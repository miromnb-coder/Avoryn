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
      <MaterialCommunityIcons name={icon} size={17} color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    flexBasis: "23.5%",
    flexDirection: "row",
    gap: 5,
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  label: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 10.5,
    fontWeight: "700",
    lineHeight: 13,
  },
});
