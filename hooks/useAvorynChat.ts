import { useCallback, useRef, useState } from "react";
import { sendMessageToAvorynAgent } from "../services/avorynAgentClient";
import type { AvorynChatMessage } from "../types/avorynChat";
import { avorynHaptics } from "../utils/avorynHaptics";

function createMessageId(role: AvorynChatMessage["role"]) {
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createErrorAnswer(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return `I could not connect to Avoryn AI right now.\n\n${message}`;
}

export function useAvorynChat() {
  const [messages, setMessages] = useState<AvorynChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const sendRunRef = useRef(0);

  const hasMessages = messages.length > 0 || isThinking;

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || isThinking) {
        return false;
      }

      avorynHaptics.success();

      const userMessage: AvorynChatMessage = {
        id: createMessageId("user"),
        role: "user",
        text: trimmedMessage,
      };

      const avorynMessageId = createMessageId("avoryn");
      const avorynMessage: AvorynChatMessage = {
        id: avorynMessageId,
        role: "avoryn",
        text: "",
      };

      const nextMessages = [...messages, userMessage];
      const runId = sendRunRef.current + 1;
      sendRunRef.current = runId;

      setMessages([...nextMessages, avorynMessage]);
      setIsThinking(true);

      try {
        const response = await sendMessageToAvorynAgent({
          messages: nextMessages.map((currentMessage) => ({
            role: currentMessage.role,
            content: currentMessage.text,
          })),
        });

        if (sendRunRef.current !== runId) {
          return true;
        }

        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === avorynMessageId ? { ...currentMessage, text: response.answer } : currentMessage,
          ),
        );
      } catch (error) {
        if (sendRunRef.current !== runId) {
          return true;
        }

        avorynHaptics.error();
        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === avorynMessageId ? { ...currentMessage, text: createErrorAnswer(error) } : currentMessage,
          ),
        );
      } finally {
        if (sendRunRef.current === runId) {
          setIsThinking(false);
        }
      }

      return true;
    },
    [isThinking, messages],
  );

  const startNewChat = useCallback(() => {
    sendRunRef.current += 1;
    setMessages([]);
    setIsThinking(false);
  }, []);

  return {
    hasMessages,
    isThinking,
    messages,
    sendMessage,
    startNewChat,
  };
}
