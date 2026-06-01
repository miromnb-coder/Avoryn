import { useMemo, useState } from "react";
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AvorynComposer, AVORYN_COMPOSER_MIN_HEIGHT } from "../components/AvorynComposer";
import { AvorynDrawerShell } from "../components/AvorynDrawerShell";
import { AvorynHeader } from "../components/AvorynHeader";
import { colors } from "../constants/colors";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

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
  const [mode, setMode] = useState<HomeMode>("intro");
  const [messages, setMessages] = useState<AvorynMessage[]>([]);
  const [composerHeight, setComposerHeight] = useState(AVORYN_COMPOSER_MIN_HEIGHT);
  const composerGrowth = Math.max(0, composerHeight - AVORYN_COMPOSER_MIN_HEIGHT);

  const titleStyle = useMemo(
    () => [styles.title, { transform: [{ translateY: -composerGrowth }] }],
    [composerGrowth],
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
                <AvorynComposer onHeightChange={setComposerHeight} onSend={handleSend} />
              </View>
            </View>
          ) : (
            <View style={styles.conversationScreen}>
              <ScrollView
                style={styles.messagesScroll}
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

              <View style={styles.conversationComposerSlot}>
                <AvorynComposer onHeightChange={setComposerHeight} onSend={handleSend} />
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
    paddingTop: 34,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 26,
    paddingTop: 24,
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
    justifyContent: "flex-end",
    minHeight: 174,
    paddingBottom: 18,
    width: "100%",
  },
});
