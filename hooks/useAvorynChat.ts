import { useCallback, useEffect, useRef, useState } from "react";
import { sendMessageToAvorynAgent } from "../services/avorynAgentClient";
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

function createErrorAnswer(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return `I could not connect to Avoryn AI right now.\n\n${message}`;
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
    } catch (error) {
      if (sendRunRef.current !== runId) {
        return;
      }

      avorynHaptics.error();
      setMessages([
        {
          id: createMessageId("avoryn"),
          role: "avoryn",
          text: createErrorAnswer(error),
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
      const runId = sendRunRef.current + 1;
      let savedConversationId = activeConversationId;
      let canSaveConversation = false;

      sendRunRef.current = runId;

      setMessages([...nextMessages, avorynMessage]);
      setIsThinking(true);

      try {
        try {
          savedConversationId = await getOrCreateAvorynConversation({
            conversationId: activeConversationId,
            firstMessage: trimmedMessage,
          });

          if (sendRunRef.current !== runId) {
            return true;
          }

          canSaveConversation = true;
          setActiveConversationId(savedConversationId);
          await saveAvorynUserMessage({
            content: trimmedMessage,
            conversationId: savedConversationId,
          });
          await refreshConversations();
        } catch {
          canSaveConversation = false;
        }

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

        if (canSaveConversation && savedConversationId) {
          try {
            await saveAvorynAssistantMessage({
              content: response.answer,
              conversationId: savedConversationId,
            });
            await refreshConversations();
          } catch {
            // Keep the answer visible even if history saving fails.
          }
        }
      } catch (error) {
        if (sendRunRef.current !== runId) {
          return true;
        }

        const errorAnswer = createErrorAnswer(error);
        avorynHaptics.error();
        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === avorynMessageId ? { ...currentMessage, text: errorAnswer } : currentMessage,
          ),
        );

        if (canSaveConversation && savedConversationId) {
          try {
            await saveAvorynAssistantMessage({
              content: errorAnswer,
              conversationId: savedConversationId,
            });
            await refreshConversations();
          } catch {
            // Keep the error visible even if history saving fails.
          }
        }
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
