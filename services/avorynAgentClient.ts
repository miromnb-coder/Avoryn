import type { AvorynAgentResponse, SendAvorynAgentMessageInput } from "../types/avorynChat";

function getLatestUserMessage(messages: SendAvorynAgentMessageInput["messages"]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content.trim() ?? "";
}

function createLocalDecisionAnswer(userMessage: string) {
  const topic = userMessage || "this";

  return `I can help you make a better everyday decision.\n\nFor this, I would compare three things first: what saves you money, what saves you time, and what gives you the best overall value.\n\nBased on “${topic}”, the smartest next step is to choose the option that gives you enough progress today without creating extra stress later.`;
}

export async function sendMessageToAvorynAgent(input: SendAvorynAgentMessageInput): Promise<AvorynAgentResponse> {
  const latestUserMessage = getLatestUserMessage(input.messages);

  // Later this function will call the Supabase Edge Function, for example:
  // POST /functions/v1/avoryn-agent
  // Keeping this service boundary now makes the real AI easy to add without changing the UI.
  await new Promise((resolve) => setTimeout(resolve, 520));

  return {
    answer: createLocalDecisionAnswer(latestUserMessage),
    provider: "local-demo",
  };
}
