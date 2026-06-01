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
          <MaterialCommunityIcons name="plus" size={27} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.circleButton} activeOpacity={0.68}>
            <MaterialCommunityIcons name="line-scan" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleButton} activeOpacity={0.68}>
            <MaterialCommunityIcons name="microphone-outline" size={23} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleButton, styles.disabledSendButton]} activeOpacity={0.68}>
            <MaterialCommunityIcons name="arrow-up" size={22} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.composer,
    borderColor: colors.composerBorder,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 132,
    paddingBottom: 13,
    paddingHorizontal: 19,
    paddingTop: 19,
    shadowColor: "#001E1B",
    shadowOffset: { width: 0, height: 13 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    width: "100%",
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 20,
    lineHeight: 25,
    margin: 0,
    minHeight: 49,
    padding: 0,
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rightActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  circleButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.44)",
    borderColor: "rgba(24,27,26,0.07)",
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  disabledSendButton: {
    backgroundColor: "rgba(24,27,26,0.045)",
  },
});
