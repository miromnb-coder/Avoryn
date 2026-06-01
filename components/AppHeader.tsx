import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export function AppHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
        <MaterialCommunityIcons name="menu" size={26} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.logo}>Avoryn</Text>

      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
        <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  iconButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  logo: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
});
