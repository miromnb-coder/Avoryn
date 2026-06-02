import { Platform, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

type AvorynRichMessageProps = {
  text: string;
};

type ParsedLine =
  | { kind: "blank"; value: string }
  | { kind: "bullet"; value: string }
  | { kind: "number"; marker: string; value: string }
  | { kind: "quote"; value: string }
  | { kind: "paragraph"; value: string };

function parseLine(line: string): ParsedLine {
  const trimmed = line.trim();

  if (!trimmed) {
    return { kind: "blank", value: "" };
  }

  const bulletMatch = trimmed.match(/^[-•]\s+(.+)$/);
  if (bulletMatch) {
    return { kind: "bullet", value: bulletMatch[1] };
  }

  const numberMatch = trimmed.match(/^(\d+[.)])\s+(.+)$/);
  if (numberMatch) {
    return { kind: "number", marker: numberMatch[1], value: numberMatch[2] };
  }

  const quoteMatch = trimmed.match(/^>\s+(.+)$/);
  if (quoteMatch) {
    return { kind: "quote", value: quoteMatch[1] };
  }

  return { kind: "paragraph", value: trimmed };
}

function renderInlineText(value: string, keyPrefix: string) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    const isBold = part.startsWith("**") && part.endsWith("**") && part.length > 4;
    const content = isBold ? part.slice(2, -2) : part;

    return (
      <Text key={`${keyPrefix}-${index}`} style={isBold ? styles.boldText : undefined}>
        {content}
      </Text>
    );
  });
}

export function AvorynRichMessage({ text }: AvorynRichMessageProps) {
  const lines = text.split("\n").map(parseLine);

  return (
    <View style={styles.container}>
      {lines.map((line, index) => {
        if (line.kind === "blank") {
          return <View key={`blank-${index}`} style={styles.blankLine} />;
        }

        if (line.kind === "bullet") {
          return (
            <View key={`bullet-${index}`} style={styles.listRow}>
              <Text style={styles.listMarker}>•</Text>
              <Text style={styles.messageText}>{renderInlineText(line.value, `bullet-text-${index}`)}</Text>
            </View>
          );
        }

        if (line.kind === "number") {
          return (
            <View key={`number-${index}`} style={styles.listRow}>
              <Text style={styles.numberMarker}>{line.marker}</Text>
              <Text style={styles.messageText}>{renderInlineText(line.value, `number-text-${index}`)}</Text>
            </View>
          );
        }

        if (line.kind === "quote") {
          return (
            <View key={`quote-${index}`} style={styles.quoteBox}>
              <Text style={styles.quoteText}>{renderInlineText(line.value, `quote-text-${index}`)}</Text>
            </View>
          );
        }

        return (
          <Text key={`paragraph-${index}`} style={styles.messageText}>
            {renderInlineText(line.value, `paragraph-text-${index}`)}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
    maxWidth: "94%",
  },
  messageText: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "400",
    letterSpacing: -0.35,
    lineHeight: 30,
  },
  boldText: {
    fontWeight: "700",
  },
  blankLine: {
    height: 10,
  },
  listRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 8,
  },
  listMarker: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    lineHeight: 30,
    marginRight: 9,
    width: 16,
  },
  numberMarker: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    lineHeight: 30,
    marginRight: 9,
    minWidth: 28,
  },
  quoteBox: {
    backgroundColor: "rgba(255,255,255,0.48)",
    borderColor: "rgba(24,27,26,0.06)",
    borderLeftColor: "rgba(24,27,26,0.22)",
    borderLeftWidth: 3,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  quoteText: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 20,
    fontWeight: "400",
    letterSpacing: -0.25,
    lineHeight: 28,
  },
});
