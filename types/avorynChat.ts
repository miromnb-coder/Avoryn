export type AvorynChatRole = "user" | "avoryn";

export type AvorynChatMessage = {
  id: string;
  role: AvorynChatRole;
  text: string;
};

export type AvorynConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

export type AvorynAgentMessage = {
  role: AvorynChatRole;
  content: string;
};

export type SendAvorynAgentMessageInput = {
  messages: AvorynAgentMessage[];
};

export type AvorynAgentResponse = {
  answer: string;
  provider: "local-demo" | "supabase-edge";
};
