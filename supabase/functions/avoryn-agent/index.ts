import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept",
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

Format answers for mobile reading:
- Use short paragraphs.
- Use bullet lists for comparisons or steps.
- Bold only key phrases using **bold**.
- Do not overuse formatting.
- End with one clear next step.`;

type AvorynMessage = {
  role?: unknown;
  content?: unknown;
};

type RequestBody = {
  messages?: AvorynMessage[];
  stream?: unknown;
};

const encoder = new TextEncoder();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function streamEvent(eventName: string, body: unknown) {
  return encoder.encode(`event: ${eventName}\ndata: ${JSON.stringify(body)}\n\n`);
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

function createOpenAIBody(model: string, messages: ReturnType<typeof normalizeMessages>, stream: boolean) {
  return JSON.stringify({
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
    stream,
  });
}

async function callOpenAI(openaiApiKey: string, model: string, messages: ReturnType<typeof normalizeMessages>, stream: boolean) {
  return fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: createOpenAIBody(model, messages, stream),
  });
}

async function streamOpenAIResponse(
  controller: ReadableStreamDefaultController<Uint8Array>,
  openaiApiKey: string,
  model: string,
  messages: ReturnType<typeof normalizeMessages>,
) {
  try {
    const openaiResponse = await callOpenAI(openaiApiKey, model, messages, true);

    if (!openaiResponse.ok) {
      const payload = await openaiResponse.json().catch(() => null);
      controller.enqueue(streamEvent("error", { error: payload?.error?.message ?? "OpenAI request failed." }));
      return;
    }

    const reader = openaiResponse.body?.pipeThrough(new TextDecoderStream()).getReader();

    if (!reader) {
      controller.enqueue(streamEvent("error", { error: "OpenAI stream was not available." }));
      return;
    }

    let buffer = "";
    let answer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += value;
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const eventText of events) {
        const dataText = eventText
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.replace("data:", "").trim())
          .join("\n");

        if (!dataText || dataText === "[DONE]") {
          continue;
        }

        const payload = JSON.parse(dataText);

        if (payload?.type === "response.output_text.delta" && typeof payload?.delta === "string") {
          answer += payload.delta;
          controller.enqueue(streamEvent("delta", { delta: payload.delta }));
        }

        if (payload?.type === "response.failed") {
          controller.enqueue(streamEvent("error", { error: payload?.response?.error?.message ?? "OpenAI stream failed." }));
          return;
        }
      }
    }

    const finalAnswer = answer.trim();

    if (!finalAnswer) {
      controller.enqueue(streamEvent("error", { error: "OpenAI returned an empty answer." }));
      return;
    }

    controller.enqueue(streamEvent("done", { answer: finalAnswer, model, provider: "openai" }));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    controller.enqueue(streamEvent("error", { error: "Avoryn stream failed.", detail }));
  } finally {
    controller.close();
  }
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

  let body: RequestBody;

  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const messages = normalizeMessages(Array.isArray(body.messages) ? body.messages : []);

  if (messages.length === 0) {
    return jsonResponse({ error: "At least one message is required." }, 400);
  }

  const wantsStream = body.stream === true || req.headers.get("accept")?.includes("text/event-stream");

  if (wantsStream) {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        void streamOpenAIResponse(controller, openaiApiKey, model, messages);
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
      },
    });
  }

  try {
    const openaiResponse = await callOpenAI(openaiApiKey, model, messages, false);
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
