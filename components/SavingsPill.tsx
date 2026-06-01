import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export function SavingsPill() {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.75}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="tag-outline" size={19} color={colors.primary} />
      </View>
      <Text style={styles.text}>
        You saved <Text style={styles.amount}>€24</Text> this week
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 18,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.mint,
    borderRadius: 12,
    height: 34,
    justifyContent: "center",
    marginRight: 12,
    width: 34,
  },
  text: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  amount: {
    color: colors.success,
    fontWeight: "800",
  },
});
