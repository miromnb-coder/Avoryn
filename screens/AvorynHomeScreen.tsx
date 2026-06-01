import { useEffect, useMemo, useState } from "react";
import { ImageBackground, Keyboard, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AvorynComposer, AVORYN_COMPOSER_MIN_HEIGHT } from "../components/AvorynComposer";
import { AvorynDrawerShell } from "../components/AvorynDrawerShell";
import { AvorynHeader } from "../components/AvorynHeader";
import { colors } from "../constants/colors";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const CONVERSATION_COMPOSER_BOTTOM = 18;
const CONVERSATION_COMPOSER_KEYBOARD_GAP = 8;
const CONVERSATION_MESSAGES_GAP = 0;

type HomeMode = "intro" | "conversation";

type AvorynMessage = {
  id: string;
  role: "user" | "avoryn";
  text: string;
};

function createDemoAnswer(userMessage: string) {
  return `I can help you make a better everyday decision.\n\nFor this, I would compare three things first: what saves you money, what saves you time, and what gives you the best overall value.\n\nBased on “${userMessage}”, the smartest next step is to look for a low-cost option nearby before choosing the fastest one.`;
}

function AvorynHomeContent({ onMenuPress }: { onMenuPress: () => void }) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<HomeMode>("intro");
  const [messages, setMessages] = useState<AvorynMessage[]>([]);
  const [composerHeight, setComposerHeight] = useState(AVORYN_COMPOSER_MIN_HEIGHT);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const composerGrowth = Math.max(0, composerHeight - AVORYN_COMPOSER_MIN_HEIGHT);
  const keyboardComposerBottom = Math.max(
    CONVERSATION_COMPOSER_KEYBOARD_GAP,
    keyboardHeight - insets.bottom + CONVERSATION_COMPOSER_KEYBOARD_GAP,
  );
  const conversationComposerBottom = keyboardHeight > 0 ? keyboardComposerBottom : CONVERSATION_COMPOSER_BOTTOM;

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

  const titleStyle = useMemo(
    () => [styles.title, { transform: [{ translateY: -composerGrowth }] }],
    [composerGrowth],
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

  function handleSend(message: string) {
    const userMessage: AvorynMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: message,
    };

    const avorynMessage: AvorynMessage = {
      id: `avoryn-${Date.now()}`,
      role: "avoryn",
      text: createDemoAnswer(message),
    };

    setMode("conversation");
    setMessages((currentMessages) => [...currentMessages, userMessage, avorynMessage]);
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

          {mode === "intro" ? (
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
                {messages.map((message) => {
                  if (message.role === "user") {
                    return (
                      <View key={message.id} style={styles.userMessageWrap}>
                        <Text style={styles.userMessageText}>{message.text}</Text>
                      </View>
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
    fontSize: 25,
    fontWeight: "400",
    letterSpacing: -0.45,
    lineHeight: 34,
    marginBottom: 28,
    maxWidth: "94%",
  },
  conversationComposerSlot: {
    left: 0,
    position: "absolute",
    right: 0,
    width: "100%",
  },
});
