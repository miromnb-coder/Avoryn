import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type CategoryChipProps = {
  label: string;
  icon: IconName;
};

export function CategoryChip({ label, icon }: CategoryChipProps) {
  return (
    <TouchableOpacity style={styles.chip} activeOpacity={0.75}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
  },
});
