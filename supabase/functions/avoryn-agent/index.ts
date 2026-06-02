import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are Avoryn, a calm AI decision assistant.

Your job is to help the user make better everyday decisions.
Do not answer like a generic chatbot.
Compare options clearly.
Focus on time, money, effort, risk, and long-term value.
Give one recommended next step.
Keep answers calm, practical, and concise.
Avoid overexplaining.
Answer in the same language the user uses unless they clearly ask otherwise.
If the user gives only a short message, ask one useful clarifying question or give a simple next step.`;

type AvorynMessage = {
  role?: unknown;
  content?: unknown;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizeMessages(messages: AvorynMessage[]) {
  return messages
    .map((message) => {
      const role = message.role === "user" ? "user" : "assistant";
      const content = typeof message.content === "string" ? message.content.trim() : "";

      return { role, content };
    })
    .filter((message) => message.content.length > 0)
    .slice(-10);
}

function extractResponseText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const textParts: string[] = [];

  if (Array.isArray(payload?.output)) {
    for (const item of payload.output) {
      if (!Array.isArray(item?.content)) {
        continue;
      }

      for (const content of item.content) {
        if (typeof content?.text === "string" && content.text.trim()) {
          textParts.push(content.text);
        }
      }
    }
  }

  return textParts.join("\n").trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-5-nano";

  if (!openaiApiKey) {
    return jsonResponse({ error: "OPENAI_API_KEY is not configured in Supabase secrets." }, 500);
  }

  let body: { messages?: AvorynMessage[] };

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const messages = normalizeMessages(Array.isArray(body.messages) ? body.messages : []);

  if (messages.length === 0) {
    return jsonResponse({ error: "At least one message is required." }, 400);
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: SYSTEM_PROMPT,
        input: messages,
        max_output_tokens: 1200,
        reasoning: {
          effort: "minimal",
        },
        text: {
          verbosity: "low",
        },
      }),
    });

    const payload = await openaiResponse.json().catch(() => null);

    if (!openaiResponse.ok) {
      return jsonResponse(
        {
          error: payload?.error?.message ?? "OpenAI request failed.",
        },
        openaiResponse.status,
      );
    }

    const answer = extractResponseText(payload);

    if (!answer) {
      return jsonResponse(
        {
          error: "OpenAI returned an empty answer.",
          detail: "The model response contained no output_text content.",
        },
        502,
      );
    }

    return jsonResponse({
      answer,
      model,
      provider: "openai",
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return jsonResponse({ error: "Avoryn agent failed.", detail }, 500);
  }
});
