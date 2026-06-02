import { hasSupabaseConfig, supabase } from "../lib/supabase";
import type { AvorynAgentResponse, SendAvorynAgentMessageInput } from "../types/avorynChat";

type AvorynAgentEdgeResponse = AvorynAgentResponse & {
  detail?: string;
  error?: string;
  message?: string;
};

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

export async function sendMessageToAvorynAgent(input: SendAvorynAgentMessageInput): Promise<AvorynAgentResponse> {
  if (!hasSupabaseConfig) {
    throw new Error("Supabase is not configured. Check your Expo environment variables.");
  }

  const accessToken = await getAccessToken();
  const { data, error } = await supabase.functions.invoke<AvorynAgentEdgeResponse>("avoryn-agent", {
    body: {
      messages: input.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
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
