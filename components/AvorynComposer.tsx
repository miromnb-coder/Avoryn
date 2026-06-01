import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export function AvorynComposer() {
  return (
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        placeholder="Ask Avoryn anything"
        placeholderTextColor={colors.placeholder}
        cursorColor="#7EA0F2"
        multiline
        textAlignVertical="top"
      />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.circleButton} activeOpacity={0.68}>
          <MaterialCommunityIcons name="plus" size={25} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.circleButton} activeOpacity={0.68}>
            <MaterialCommunityIcons name="line-scan" size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleButton} activeOpacity={0.68}>
            <MaterialCommunityIcons name="microphone-outline" size={21} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleButton, styles.disabledSendButton]} activeOpacity={0.68}>
            <MaterialCommunityIcons name="arrow-up" size={20} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    backgroundColor: colors.composer,
    borderColor: colors.composerBorder,
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 122,
    paddingBottom: 12,
    paddingHorizontal: 18,
    paddingTop: 18,
    shadowColor: "#001E1B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.055,
    shadowRadius: 20,
    width: "94%",
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 19,
    lineHeight: 24,
    margin: 0,
    minHeight: 45,
    padding: 0,
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  rightActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  circleButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.36)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  disabledSendButton: {
    backgroundColor: "rgba(24,27,26,0.04)",
  },
});
