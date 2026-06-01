import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function SectionTitle({ title, subtitle, icon = "star-four-points-outline" }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name={icon} size={17} color={colors.primaryDark} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    marginBottom: 10,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.25,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12.5,
    marginTop: 4,
  },
});
