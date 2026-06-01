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
          <MaterialCommunityIcons name="plus" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.circleButton} activeOpacity={0.68}>
            <MaterialCommunityIcons name="line-scan" size={17} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleButton} activeOpacity={0.68}>
            <MaterialCommunityIcons name="microphone-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleButton, styles.disabledSendButton]} activeOpacity={0.68}>
            <MaterialCommunityIcons name="arrow-up" size={19} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    backgroundColor: "#FAFCFA",
    borderColor: "rgba(7,59,58,0.08)",
    borderRadius: 21,
    borderWidth: 1,
    minHeight: 116,
    paddingBottom: 11,
    paddingHorizontal: 17,
    paddingTop: 17,
    shadowColor: "#001E1B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.045,
    shadowRadius: 18,
    width: "86%",
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    lineHeight: 23,
    margin: 0,
    minHeight: 42,
    padding: 0,
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  rightActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  circleButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.34)",
    borderColor: "rgba(24,27,26,0.045)",
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  disabledSendButton: {
    backgroundColor: "rgba(24,27,26,0.035)",
  },
});
