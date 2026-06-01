import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export function AvorynHeader() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton} activeOpacity={0.68}>
        <MaterialCommunityIcons name="menu" size={25} color={colors.text} />
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
    minHeight: 54,
    width: "100%",
  },
  menuButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  logo: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: -0.3,
  },
  rightSpacer: {
    height: 42,
    width: 42,
  },
});
