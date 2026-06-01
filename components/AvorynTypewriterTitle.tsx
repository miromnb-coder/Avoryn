import { useEffect, useState } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Platform, StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const TITLE_PHRASES = [
  "What are you\ntrying to do?",
  "What decision\nare you making?",
  "What would make\ntoday easier?",
  "What should you\nchoose today?",
];

const TYPE_DELAY_MS = 48;
const DELETE_DELAY_MS = 30;
const HOLD_DELAY_MS = 2400;
const PAUSE_BETWEEN_PHRASES_MS = 260;
const CURSOR_BLINK_DELAY_MS = 560;

type TypewriterPhase = "typing" | "holding" | "deleting" | "pausing";

type AvorynTypewriterTitleProps = {
  active?: boolean;
  textStyle?: StyleProp<TextStyle>;
};

export function AvorynTypewriterTitle({ active = true, textStyle }: AvorynTypewriterTitleProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(TITLE_PHRASES[0].length);
  const [phase, setPhase] = useState<TypewriterPhase>("holding");
  const [cursorVisible, setCursorVisible] = useState(true);

  const currentPhrase = TITLE_PHRASES[phraseIndex];
  const visibleText = currentPhrase.slice(0, visibleLength);
  const cursor = cursorVisible && active ? "|" : "";

  useEffect(() => {
    if (!active) {
      setCursorVisible(false);
      return;
    }

    setCursorVisible(true);

    const interval = setInterval(() => {
      setCursorVisible((isVisible) => !isVisible);
    }, CURSOR_BLINK_DELAY_MS);

    return () => {
      clearInterval(interval);
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (visibleLength < currentPhrase.length) {
        timeout = setTimeout(() => {
          setVisibleLength((length) => length + 1);
        }, TYPE_DELAY_MS);
      } else {
        timeout = setTimeout(() => {
          setPhase("holding");
        }, HOLD_DELAY_MS);
      }
    }

    if (phase === "holding") {
      timeout = setTimeout(() => {
        setPhase("deleting");
      }, HOLD_DELAY_MS);
    }

    if (phase === "deleting") {
      if (visibleLength > 0) {
        timeout = setTimeout(() => {
          setVisibleLength((length) => Math.max(0, length - 1));
        }, DELETE_DELAY_MS);
      } else {
        timeout = setTimeout(() => {
          setPhraseIndex((index) => (index + 1) % TITLE_PHRASES.length);
          setPhase("pausing");
        }, PAUSE_BETWEEN_PHRASES_MS);
      }
    }

    if (phase === "pausing") {
      timeout = setTimeout(() => {
        setPhase("typing");
      }, PAUSE_BETWEEN_PHRASES_MS);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [active, currentPhrase.length, phase, visibleLength]);

  useEffect(() => {
    if (phase === "pausing") {
      setVisibleLength(0);
    }
  }, [phase, phraseIndex]);

  return (
    <Text style={[styles.title, textStyle]}>
      {visibleText}
      <Text style={styles.cursor}>{cursor}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: -1.15,
    lineHeight: 48,
    marginBottom: 24,
    minHeight: 96,
    textAlign: "center",
  },
  cursor: {
    color: "rgba(24,27,26,0.64)",
    fontWeight: "300",
  },
});
