import { hasSupabaseConfig, supabase } from "../lib/supabase";
import type { AvorynChatMessage, AvorynChatRole, AvorynConversationSummary } from "../types/avorynChat";

type ConversationRow = {
  id: string;
  title: string | null;
  updated_at: string | null;
  last_message_at: string | null;
};

type MessageRow = {
  id: string;
  role: AvorynChatRole;
  content: string;
};

type ConversationIdInput = {
  conversationId?: string | null;
  firstMessage: string;
};

type SaveMessageInput = {
  content: string;
  conversationId: string;
  role: AvorynChatRole;
};

const MAX_TITLE_CHARS = 28;
const MAX_TITLE_WORDS = 5;

function createConversationTitle(message: string) {
  const cleanMessage = message
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[!?.,:;]+$/g, "")
    .trim();

  if (!cleanMessage) {
    return "New chat";
  }

  const words = cleanMessage.split(" ").filter(Boolean).slice(0, MAX_TITLE_WORDS);
  const wordTitle = words.join(" ");
  const baseTitle = wordTitle.length > MAX_TITLE_CHARS ? wordTitle.slice(0, MAX_TITLE_CHARS - 1).trim() : wordTitle;
  const shouldTruncate = cleanMessage.length > baseTitle.length;

  return shouldTruncate ? `${baseTitle}…` : baseTitle;
}

function normalizeStoredTitle(title: string | null) {
  return createConversationTitle(title?.trim() || "New chat");
}

async function getCurrentUserId() {
  if (!hasSupabaseConfig) {
    throw new Error("Supabase is not configured. Check your Expo environment variables.");
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  const userId = data.user?.id;

  if (!userId) {
    throw new Error("You need to be signed in to use conversation history.");
  }

  return userId;
}

export async function fetchAvorynConversations(): Promise<AvorynConversationSummary[]> {
  if (!hasSupabaseConfig) {
    return [];
  }

  const { data, error } = await supabase
    .from("avoryn_conversations")
    .select("id,title,updated_at,last_message_at")
    .order("last_message_at", { ascending: false })
    .limit(30);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ConversationRow[]).map((conversation) => ({
    id: conversation.id,
    title: normalizeStoredTitle(conversation.title),
    updatedAt: conversation.last_message_at ?? conversation.updated_at ?? "",
  }));
}

export async function fetchAvorynConversationMessages(conversationId: string): Promise<AvorynChatMessage[]> {
  if (!hasSupabaseConfig) {
    return [];
  }

  const { data, error } = await supabase
    .from("avoryn_messages")
    .select("id,role,content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as MessageRow[]).map((message) => ({
    id: message.id,
    role: message.role,
    text: message.content,
  }));
}

export async function getOrCreateAvorynConversation({ conversationId, firstMessage }: ConversationIdInput) {
  const userId = await getCurrentUserId();

  if (conversationId) {
    const { data, error } = await supabase
      .from("avoryn_conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data?.id) {
      return data.id as string;
    }
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("avoryn_conversations")
    .insert({
      user_id: userId,
      title: createConversationTitle(firstMessage),
      updated_at: now,
      last_message_at: now,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error("Conversation was not created.");
  }

  return data.id as string;
}

export async function saveAvorynUserMessage(input: Omit<SaveMessageInput, "role">) {
  return saveAvorynMessage({ ...input, role: "user" });
}

export async function saveAvorynAssistantMessage(input: Omit<SaveMessageInput, "role">) {
  return saveAvorynMessage({ ...input, role: "avoryn" });
}

async function saveAvorynMessage({ content, conversationId, role }: SaveMessageInput) {
  const cleanContent = content.trim();

  if (!cleanContent) {
    return null;
  }

  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("avoryn_messages")
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role,
      content: cleanContent,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id as string | undefined;
}
