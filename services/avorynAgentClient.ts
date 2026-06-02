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

const STREAM_TIMEOUT_MS = 60000;

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

function readXhrError(xhr: XMLHttpRequest) {
  try {
    const payload = JSON.parse(xhr.responseText || "{}") as { detail?: unknown; error?: unknown; message?: unknown };
    const error = typeof payload.error === "string" ? payload.error : null;
    const detail = typeof payload.detail === "string" ? payload.detail : null;
    const message = typeof payload.message === "string" ? payload.message : null;

    return detail ?? error ?? message ?? "Avoryn stream request failed.";
  } catch {
    return xhr.responseText?.trim() || "Avoryn stream request failed.";
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

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let lastIndex = 0;
    let buffer = "";
    let answer = "";
    let settled = false;

    function settleWithError(error: Error) {
      if (settled) {
        return;
      }

      settled = true;
      reject(error);
    }

    function settleWithAnswer() {
      if (settled) {
        return;
      }

      const finalAnswer = answer.trim();

      if (!finalAnswer) {
        settleWithError(new Error("Avoryn returned an empty streamed answer."));
        return;
      }

      settled = true;
      resolve({ answer: finalAnswer, provider: "supabase-edge" });
    }

    function consumeEvent(eventText: string) {
      const event = parseStreamEvent(eventText);

      if (!event) {
        return;
      }

      if (event.eventName === "error") {
        const error = typeof event.payload.error === "string" ? event.payload.error : "Avoryn stream failed.";
        const detail = typeof event.payload.detail === "string" ? event.payload.detail : null;
        settleWithError(new Error(detail ?? error));
        return;
      }

      if (event.eventName === "delta" && typeof event.payload.delta === "string") {
        answer += event.payload.delta;
        callbacks.onDelta(event.payload.delta);
      }

      if (event.eventName === "done" && typeof event.payload.answer === "string") {
        answer = event.payload.answer;
        settleWithAnswer();
      }
    }

    function consumePendingText() {
      const nextText = xhr.responseText.slice(lastIndex);
      lastIndex = xhr.responseText.length;

      if (!nextText) {
        return;
      }

      buffer += nextText;
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      events.forEach(consumeEvent);
    }

    xhr.open("POST", `${supabaseUrl}/functions/v1/avoryn-agent`);
    xhr.timeout = STREAM_TIMEOUT_MS;
    xhr.setRequestHeader("Accept", "text/event-stream");
    xhr.setRequestHeader("apikey", supabasePublishableKey);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onprogress = consumePendingText;
    xhr.onerror = () => settleWithError(new Error("Avoryn stream request failed."));
    xhr.ontimeout = () => settleWithError(new Error("Avoryn stream timed out."));
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        settleWithError(new Error(readXhrError(xhr)));
        return;
      }

      consumePendingText();

      if (buffer.trim()) {
        consumeEvent(buffer);
        buffer = "";
      }

      settleWithAnswer();
    };

    xhr.send(
      JSON.stringify({
        messages: toEdgeMessages(input),
        stream: true,
      }),
    );
  });
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
