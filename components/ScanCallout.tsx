import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export function ScanCallout() {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.78}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="barcode-scan" size={25} color={colors.primaryDark} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Scan before you buy</Text>
        <Text style={styles.subtitle}>Check prices, compare options and avoid bad deals.</Text>
      </View>

      <View style={styles.button}>
        <MaterialCommunityIcons name="arrow-right" size={25} color={colors.card} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    padding: 11,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 3,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
});
