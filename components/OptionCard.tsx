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
  const isPrimary = action === "Go" || action === "View" || action === "Scan";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.78}>
      <View style={[styles.iconWrap, { backgroundColor: toneColors[tone] }]}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primaryDark} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
          {description}
        </Text>
        <Text style={styles.detail} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86}>
          {detail}
        </Text>
      </View>

      <View style={styles.rightSide}>
        <View style={[styles.actionButton, isPrimary ? styles.primaryAction : styles.secondaryAction]}>
          <Text
            style={[styles.actionText, isPrimary ? styles.primaryActionText : styles.secondaryActionText]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
          >
            {action}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={18} color={colors.muted} />
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
    minHeight: 76,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.045,
    shadowRadius: 13,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    marginRight: 12,
    width: 52,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  description: {
    color: colors.text,
    fontSize: 12.4,
    fontWeight: "650",
  },
  detail: {
    color: colors.muted,
    fontSize: 11.2,
    marginTop: 3,
  },
  rightSide: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    marginLeft: 6,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 32,
    minWidth: 54,
    paddingHorizontal: 10,
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
    fontSize: 11.5,
    fontWeight: "800",
  },
  primaryActionText: {
    color: colors.card,
  },
  secondaryActionText: {
    color: colors.primaryDark,
  },
});
