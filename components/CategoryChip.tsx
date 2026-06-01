import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type CategoryChipProps = {
  label: string;
  icon: IconName;
  isActive: boolean;
  onPress: () => void;
};

export function CategoryChip({ label, icon, isActive, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.activeChip]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} size={17} color={isActive ? colors.card : colors.primary} />
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
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
    flex: 1,
    flexDirection: "row",
    gap: 5,
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  activeChip: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  label: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 12,
    textAlign: "left",
  },
  activeLabel: {
    color: colors.card,
  },
});
