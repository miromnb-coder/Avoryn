import { hasSupabaseConfig, supabase, supabasePublishableKey, supabaseUrl } from "../lib/supabase";
import type { AvorynAgentResponse, SendAvorynAgentMessageInput } from "../types/avorynChat";

type AvorynAgentEdgeResponse = AvorynAgentResponse & {
  detail?: string;
  error?: string;
  message?: string;
};

type AvorynStreamCallbacks = {
  onDelta: (delta: string) => void;
};

type StreamEventPayload = {
  answer?: unknown;
  delta?: unknown;
  detail?: unknown;
  error?: unknown;
};

function toEdgeRole(role: SendAvorynAgentMessageInput["messages"][number]["role"]) {
  return role === "avoryn" ? "assistant" : "user";
}

function toEdgeMessages(input: SendAvorynAgentMessageInput) {
  return input.messages.map((message) => ({
    role: toEdgeRole(message.role),
    content: message.content,
  }));
}

async function getFunctionErrorMessage(error: unknown) {
  const fallback = error instanceof Error ? error.message : "Avoryn agent request failed.";
  const context = (error as { context?: { json?: () => Promise<unknown>; text?: () => Promise<string> } })?.context;

  if (!context) {
    return fallback;
  }

  try {
    const payload = await context.json?.();

    if (payload && typeof payload === "object") {
      const body = payload as { detail?: unknown; error?: unknown; message?: unknown };
      const detail = typeof body.detail === "string" ? body.detail : null;
      const message =
        typeof body.error === "string" ? body.error : typeof body.message === "string" ? body.message : null;

      return detail ?? message ?? fallback;
    }
  } catch {
    // Fall back to text below.
  }

  try {
    const text = await context.text?.();
    return text?.trim() || fallback;
  } catch {
    return fallback;
  }
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new Error("You need to be signed in to use Avoryn AI.");
  }

  return accessToken;
}

function parseStreamEvent(eventText: string) {
  const eventName = eventText
    .split("\n")
    .find((line) => line.startsWith("event:"))
    ?.replace("event:", "")
    .trim();
  const dataText = eventText
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.replace("data:", "").trim())
    .join("\n");

  if (!dataText) {
    return null;
  }

  try {
    return { eventName, payload: JSON.parse(dataText) as StreamEventPayload };
  } catch {
    return null;
  }
}

async function readErrorResponse(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: unknown; error?: unknown; message?: unknown };
    const error = typeof payload.error === "string" ? payload.error : null;
    const detail = typeof payload.detail === "string" ? payload.detail : null;
    const message = typeof payload.message === "string" ? payload.message : null;

    return detail ?? error ?? message ?? "Avoryn stream request failed.";
  } catch {
    return (await response.text().catch(() => "")) || "Avoryn stream request failed.";
  }
}

export async function streamMessageToAvorynAgent(
  input: SendAvorynAgentMessageInput,
  callbacks: AvorynStreamCallbacks,
): Promise<AvorynAgentResponse> {
  if (!hasSupabaseConfig) {
    throw new Error("Supabase is not configured. Check your Expo environment variables.");
  }

  const accessToken = await getAccessToken();
  const response = await fetch(`${supabaseUrl}/functions/v1/avoryn-agent`, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      apikey: supabasePublishableKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: toEdgeMessages(input),
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorResponse(response));
  }

  const reader = response.body?.getReader?.();

  if (!reader) {
    throw new Error("Streaming is not available on this device.");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventText of events) {
      const event = parseStreamEvent(eventText);

      if (!event) {
        continue;
      }

      if (event.eventName === "error") {
        const error = typeof event.payload.error === "string" ? event.payload.error : "Avoryn stream failed.";
        const detail = typeof event.payload.detail === "string" ? event.payload.detail : null;
        throw new Error(detail ?? error);
      }

      if (event.eventName === "delta" && typeof event.payload.delta === "string") {
        answer += event.payload.delta;
        callbacks.onDelta(event.payload.delta);
      }

      if (event.eventName === "done" && typeof event.payload.answer === "string") {
        answer = event.payload.answer;
      }
    }
  }

  const finalAnswer = answer.trim();

  if (!finalAnswer) {
    throw new Error("Avoryn returned an empty streamed answer.");
  }

  return {
    answer: finalAnswer,
    provider: "supabase-edge",
  };
}

export async function sendMessageToAvorynAgent(input: SendAvorynAgentMessageInput): Promise<AvorynAgentResponse> {
  if (!hasSupabaseConfig) {
    throw new Error("Supabase is not configured. Check your Expo environment variables.");
  }

  const accessToken = await getAccessToken();
  const { data, error } = await supabase.functions.invoke<AvorynAgentEdgeResponse>("avoryn-agent", {
    body: {
      messages: toEdgeMessages(input),
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error));
  }

  if (data?.error) {
    throw new Error(data.detail ?? data.message ?? data.error);
  }

  const answer = data?.answer?.trim();

  if (!answer) {
    throw new Error("Avoryn returned an empty answer. Try sending the message again.");
  }

  return {
    answer,
    provider: data?.provider ?? "supabase-edge",
  };
}
