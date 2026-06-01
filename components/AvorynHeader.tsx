import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export function AvorynHeader() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} activeOpacity={0.68}>
        <MaterialCommunityIcons name="menu" size={29} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.logo}>Avoryn</Text>

      <View style={styles.rightSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    width: "100%",
  },
  menuButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  logo: {
    color: colors.text,
    fontFamily: "serif",
    fontSize: 31,
    fontWeight: "500",
    letterSpacing: -0.4,
  },
  rightSpacer: {
    height: 44,
    width: 44,
  },
});
