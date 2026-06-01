import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type OptionCardProps = {
  title: string;
  description: string;
  detail: string;
  action: string;
  icon: IconName;
  tone: "mint" | "yellow" | "blue";
};

const toneColors = {
  mint: colors.mint,
  yellow: colors.yellow,
  blue: colors.blue,
};

export function OptionCard({ title, description, detail, action, icon, tone }: OptionCardProps) {
  const isPrimary = action === "Go";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.78}>
      <View style={[styles.iconWrap, { backgroundColor: toneColors[tone] }]}>
        <MaterialCommunityIcons name={icon} size={25} color={colors.primaryDark} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
        <Text style={styles.detail} numberOfLines={1}>{detail}</Text>
      </View>

      <View style={styles.rightSide}>
        <View style={[styles.actionButton, isPrimary ? styles.primaryAction : styles.secondaryAction]}>
          <Text style={[styles.actionText, isPrimary ? styles.primaryActionText : styles.secondaryActionText]}>
            {action}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    marginBottom: 8,
    minHeight: 78,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.045,
    shadowRadius: 13,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 14,
    height: 54,
    justifyContent: "center",
    marginRight: 12,
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
    marginBottom: 2,
  },
  description: {
    color: colors.text,
    fontSize: 12.8,
    fontWeight: "600",
  },
  detail: {
    color: colors.muted,
    fontSize: 11.5,
    marginTop: 3,
  },
  rightSide: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginLeft: 7,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 34,
    minWidth: 56,
    paddingHorizontal: 12,
  },
  primaryAction: {
    backgroundColor: colors.primaryDark,
  },
  secondaryAction: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "800",
  },
  primaryActionText: {
    color: colors.card,
  },
  secondaryActionText: {
    color: colors.primaryDark,
  },
});
