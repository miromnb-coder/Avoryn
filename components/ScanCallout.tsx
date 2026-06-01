import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export function ScanCallout() {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.78}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="barcode-scan" size={30} color={colors.primaryDark} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Scan before you buy</Text>
        <Text style={styles.subtitle}>Check prices, compare options and avoid bad deals.</Text>
      </View>

      <View style={styles.button}>
        <MaterialCommunityIcons name="arrow-right" size={28} color={colors.card} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
    padding: 14,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 62,
    justifyContent: "center",
    width: 62,
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13.5,
    lineHeight: 19,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: 999,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
});
