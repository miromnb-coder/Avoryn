import { useEffect, useMemo, useRef, useState } from "react";
import { ImageBackground, Keyboard, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AvorynComposer, AVORYN_COMPOSER_MIN_HEIGHT } from "../components/AvorynComposer";
import { AvorynDrawerShell } from "../components/AvorynDrawerShell";
import { AvorynHeader } from "../components/AvorynHeader";
import { colors } from "../constants/colors";
import { useAvorynChat } from "../hooks/useAvorynChat";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const CONVERSATION_COMPOSER_BOTTOM = 18;
const CONVERSATION_COMPOSER_KEYBOARD_GAP = 8;
const CONVERSATION_MESSAGES_GAP = 0;
const INTRO_TO_CONVERSATION_DELAY_MS = 420;

type HomeMode = "intro" | "transitioning" | "conversation";

function AvorynHomeContent({ onMenuPress }: { onMenuPress: () => void }) {
  const insets = useSafeAreaInsets();
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chat = useAvorynChat();
  const [mode, setMode] = useState<HomeMode>("intro");
  const [composerHeight, setComposerHeight] = useState(AVORYN_COMPOSER_MIN_HEIGHT);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const composerGrowth = Math.max(0, composerHeight - AVORYN_COMPOSER_MIN_HEIGHT);
  const keyboardComposerBottom = Math.max(
    CONVERSATION_COMPOSER_KEYBOARD_GAP,
    keyboardHeight - insets.bottom + CONVERSATION_COMPOSER_KEYBOARD_GAP,
  );
  const shouldLiftConversationComposer = mode === "conversation" && isComposerFocused && keyboardHeight > 0;
  const conversationComposerBottom = shouldLiftConversationComposer ? keyboardComposerBottom : CONVERSATION_COMPOSER_BOTTOM;

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      setIsComposerFocused(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const titleStyle = useMemo(
    () => [styles.title, { transform: [{ translateY: -composerGrowth }] }, mode === "transitioning" && styles.titleHidden],
    [composerGrowth, mode],
  );

  const messagesScrollStyle = useMemo(
    () => [
      styles.messagesScroll,
      {
        bottom: conversationComposerBottom + composerHeight + CONVERSATION_MESSAGES_GAP,
      },
    ],
    [composerHeight, conversationComposerBottom],
  );

  const conversationComposerStyle = useMemo(
    () => [styles.conversationComposerSlot, { bottom: conversationComposerBottom }],
    [conversationComposerBottom],
  );

  async function handleSend(message: string) {
    const sent = await chat.sendMessage(message);

    if (!sent) {
      return;
    }

    if (mode === "intro") {
      Keyboard.dismiss();
      setIsComposerFocused(false);
      setKeyboardHeight(0);
      setMode("transitioning");

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setMode("conversation");
        transitionTimeoutRef.current = null;
      }, INTRO_TO_CONVERSATION_DELAY_MS);

      return;
    }

    if (mode === "transitioning") {
      return;
    }

    setMode("conversation");
  }

  return (
    <ImageBackground
      source={require("../assets/backgrounds/avoryn-background.PNG")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <AvorynHeader onMenuPress={onMenuPress} />

          {mode !== "conversation" ? (
            <View style={styles.hero}>
              <Text style={titleStyle}>What are you{`\n`}trying to do?</Text>
              <View style={styles.introComposerSlot}>
                <AvorynComposer
                  onBlur={() => setIsComposerFocused(false)}
                  onFocus={() => setIsComposerFocused(true)}
                  onHeightChange={setComposerHeight}
                  onSend={handleSend}
                />
              </View>
            </View>
          ) : (
            <View style={styles.conversationScreen}>
              <ScrollView
                style={messagesScrollStyle}
                contentContainerStyle={styles.messagesContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {chat.messages.map((message) => {
                  if (message.role === "user") {
                    return (
                      <View key={message.id} style={styles.userMessageWrap}>
                        <Text style={styles.userMessageText}>{message.text}</Text>
                      </View>
                    );
                  }

                  if (!message.text && chat.isThinking) {
                    return (
                      <Text key={message.id} style={styles.thinkingText}>
                        Thinking through the best option…
                      </Text>
                    );
                  }

                  return (
                    <Text key={message.id} style={styles.avorynMessageText}>
                      {message.text}
                    </Text>
                  );
                })}
              </ScrollView>

              <View style={conversationComposerStyle}>
                <AvorynComposer
                  onBlur={() => setIsComposerFocused(false)}
                  onFocus={() => setIsComposerFocused(true)}
                  onHeightChange={setComposerHeight}
                  onSend={handleSend}
                />
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export function AvorynHomeScreen() {
  return <AvorynDrawerShell>{({ openDrawer }) => <AvorynHomeContent onMenuPress={openDrawer} />}</AvorynDrawerShell>;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: "transparent",
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 0,
  },
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 138,
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: -1.15,
    lineHeight: 48,
    marginBottom: 24,
    textAlign: "center",
  },
  titleHidden: {
    opacity: 0,
  },
  introComposerSlot: {
    height: 174,
    justifyContent: "flex-end",
    width: "100%",
  },
  conversationScreen: {
    flex: 1,
    position: "relative",
  },
  messagesScroll: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 8,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 0,
    paddingTop: 4,
  },
  userMessageWrap: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderColor: "rgba(24,27,26,0.05)",
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 22,
    maxWidth: "82%",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  userMessageText: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 23,
  },
  avorynMessageText: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "400",
    letterSpacing: -0.35,
    lineHeight: 30,
    marginBottom: 26,
    maxWidth: "94%",
  },
  thinkingText: {
    color: "rgba(24,27,26,0.58)",
    fontFamily: serifFont,
    fontSize: 20,
    fontWeight: "400",
    letterSpacing: -0.25,
    lineHeight: 28,
    marginBottom: 26,
    maxWidth: "94%",
  },
  conversationComposerSlot: {
    left: 0,
    position: "absolute",
    right: 0,
    width: "100%",
  },
});
