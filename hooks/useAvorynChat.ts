import { useCallback, useEffect, useRef, useState } from "react";
import { sendMessageToAvorynAgent, streamMessageToAvorynAgent } from "../services/avorynAgentClient";
import {
  fetchAvorynConversationMessages,
  fetchAvorynConversations,
  getOrCreateAvorynConversation,
  saveAvorynAssistantMessage,
  saveAvorynUserMessage,
} from "../services/avorynConversationStorage";
import type { AvorynChatMessage, AvorynConversationSummary } from "../types/avorynChat";
import { avorynHaptics } from "../utils/avorynHaptics";

function createMessageId(role: AvorynChatMessage["role"]) {
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createErrorAnswer() {
  return "Avoryn had trouble answering just now. Try again in a moment.";
}

export function useAvorynChat() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<AvorynConversationSummary[]>([]);
  const [messages, setMessages] = useState<AvorynChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const sendRunRef = useRef(0);

  const hasMessages = messages.length > 0 || isThinking;

  const refreshConversations = useCallback(async () => {
    setIsLoadingConversations(true);

    try {
      const nextConversations = await fetchAvorynConversations();
      setConversations(nextConversations);
    } catch {
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const startNewChat = useCallback(() => {
    sendRunRef.current += 1;
    setActiveConversationId(null);
    setMessages([]);
    setIsLoadingConversation(false);
    setIsThinking(false);
  }, []);

  const selectConversation = useCallback(async (conversationId: string) => {
    sendRunRef.current += 1;
    const runId = sendRunRef.current;

    setIsThinking(false);
    setIsLoadingConversation(true);
    setActiveConversationId(conversationId);
    setMessages([]);

    try {
      const nextMessages = await fetchAvorynConversationMessages(conversationId);

      if (sendRunRef.current !== runId) {
        return;
      }

      setMessages(nextMessages);
    } catch {
      if (sendRunRef.current !== runId) {
        return;
      }

      avorynHaptics.error();
      setMessages([
        {
          id: createMessageId("avoryn"),
          role: "avoryn",
          text: createErrorAnswer(),
        },
      ]);
    } finally {
      if (sendRunRef.current === runId) {
        setIsLoadingConversation(false);
      }
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage || isThinking || isLoadingConversation) {
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
      const agentInput = {
        messages: nextMessages.map((currentMessage) => ({
          role: currentMessage.role,
          content: currentMessage.text,
        })),
      };
      const runId = sendRunRef.current + 1;
      let savedConversationId: string | null = activeConversationId;

      sendRunRef.current = runId;

      setMessages([...nextMessages, avorynMessage]);
      setIsThinking(true);

      const historySavePromise = (async () => {
        const conversationId = await getOrCreateAvorynConversation({
          conversationId: activeConversationId,
          firstMessage: trimmedMessage,
        });

        if (sendRunRef.current !== runId) {
          return null;
        }

        savedConversationId = conversationId;
        setActiveConversationId(conversationId);

        await saveAvorynUserMessage({
          content: trimmedMessage,
          conversationId,
        });

        void refreshConversations();
        return conversationId;
      })().catch(() => null);

      try {
        let streamedAnswer = "";

        let response = await streamMessageToAvorynAgent(agentInput, {
          onDelta(delta) {
            if (sendRunRef.current !== runId) {
              return;
            }

            streamedAnswer += delta;
            setMessages((currentMessages) =>
              currentMessages.map((currentMessage) =>
                currentMessage.id === avorynMessageId
                  ? { ...currentMessage, text: `${currentMessage.text}${delta}` }
                  : currentMessage,
              ),
            );
          },
        }).catch(async () => {
          streamedAnswer = "";
          setMessages((currentMessages) =>
            currentMessages.map((currentMessage) =>
              currentMessage.id === avorynMessageId ? { ...currentMessage, text: "" } : currentMessage,
            ),
          );
          return sendMessageToAvorynAgent(agentInput);
        });

        if (sendRunRef.current !== runId) {
          return true;
        }

        const finalAnswer = response.answer.trim() || streamedAnswer.trim();

        if (!finalAnswer) {
          throw new Error("Empty Avoryn answer");
        }

        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === avorynMessageId ? { ...currentMessage, text: finalAnswer } : currentMessage,
          ),
        );

        const conversationId = (await historySavePromise) ?? savedConversationId;

        if (conversationId && sendRunRef.current === runId) {
          try {
            await saveAvorynAssistantMessage({
              content: finalAnswer,
              conversationId,
            });
            void refreshConversations();
          } catch {
            // Keep the answer visible even if history saving fails.
          }
        }
      } catch {
        if (sendRunRef.current !== runId) {
          return true;
        }

        avorynHaptics.error();
        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === avorynMessageId ? { ...currentMessage, text: createErrorAnswer() } : currentMessage,
          ),
        );

        void historySavePromise;
      } finally {
        if (sendRunRef.current === runId) {
          setIsThinking(false);
        }
      }

      return true;
    },
    [activeConversationId, isLoadingConversation, isThinking, messages, refreshConversations],
  );

  useEffect(() => {
    void refreshConversations();
  }, [refreshConversations]);

  return {
    activeConversationId,
    conversations,
    hasMessages,
    isLoadingConversation,
    isLoadingConversations,
    isThinking,
    messages,
    refreshConversations,
    selectConversation,
    sendMessage,
    startNewChat,
  };
}
