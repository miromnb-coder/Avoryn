import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";
import { avorynHaptics } from "../utils/avorynHaptics";

const INPUT_LINE_HEIGHT = 22;
const MIN_INPUT_HEIGHT = 28;
const MAX_INPUT_HEIGHT = INPUT_LINE_HEIGHT * 4;
const CARD_VERTICAL_CHROME = 16 + 15 + 44 + 11;
const MIN_CARD_HEIGHT = CARD_VERTICAL_CHROME + MIN_INPUT_HEIGHT;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function VoiceWaveIcon() {
  return (
    <View style={styles.waveIcon}>
      <View style={[styles.waveBar, styles.waveBarShort]} />
      <View style={[styles.waveBar, styles.waveBarMedium]} />
      <View style={[styles.waveBar, styles.waveBarTall]} />
      <View style={[styles.waveBar, styles.waveBarMedium]} />
      <View style={[styles.waveBar, styles.waveBarShort]} />
    </View>
  );
}

export function AvorynComposer() {
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);

  const trimmedMessage = message.trim();
  const hasMessage = trimmedMessage.length > 0;

  const cardStyle = useMemo(
    () => [styles.card, { height: CARD_VERTICAL_CHROME + inputHeight }],
    [inputHeight],
  );

  const inputStyle = useMemo(
    () => [styles.input, { height: inputHeight }],
    [inputHeight],
  );

  function handleSend() {
    if (!hasMessage) {
      avorynHaptics.select();
      return;
    }

    avorynHaptics.success();
    setMessage("");
    setInputHeight(MIN_INPUT_HEIGHT);
  }

  return (
    <View style={cardStyle}>
      <TextInput
        style={inputStyle}
        value={message}
        onChangeText={setMessage}
        onContentSizeChange={(event) => {
          const nextHeight = clamp(
            Math.ceil(event.nativeEvent.contentSize.height),
            MIN_INPUT_HEIGHT,
            MAX_INPUT_HEIGHT,
          );
          setInputHeight(nextHeight);
        }}
        placeholder="Ask Avoryn anything"
        placeholderTextColor={colors.placeholder}
        cursorColor="#7EA0F2"
        multiline
        scrollEnabled={inputHeight >= MAX_INPUT_HEIGHT}
        textAlignVertical="top"
      />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.circleButton} activeOpacity={0.68} onPress={avorynHaptics.select}>
          <MaterialCommunityIcons name="plus" size={25} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.voiceButton, hasMessage && styles.sendButton]}
          activeOpacity={0.68}
          onPress={handleSend}
        >
          {hasMessage ? (
            <MaterialCommunityIcons name="arrow-up" size={20} color="#FFFFFF" />
          ) : (
            <VoiceWaveIcon />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "rgba(24,27,26,0.045)",
    borderRadius: 28,
    borderWidth: 1,
    minHeight: MIN_CARD_HEIGHT,
    paddingBottom: 11,
    paddingHorizontal: 21,
    paddingTop: 16,
    shadowColor: "#001E1B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.055,
    shadowRadius: 22,
    width: "100%",
  },
  input: {
    color: colors.text,
    fontSize: 17,
    lineHeight: INPUT_LINE_HEIGHT,
    margin: 0,
    padding: 0,
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  circleButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.56)",
    borderColor: "rgba(24,27,26,0.075)",
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  voiceButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  sendButton: {
    backgroundColor: colors.text,
    borderRadius: 999,
  },
  waveIcon: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2.5,
    height: 22,
    justifyContent: "center",
    width: 23,
  },
  waveBar: {
    backgroundColor: colors.text,
    borderRadius: 999,
    width: 2.25,
  },
  waveBarShort: {
    height: 10,
  },
  waveBarMedium: {
    height: 16,
  },
  waveBarTall: {
    height: 21,
  },
});
