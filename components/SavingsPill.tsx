import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

type SavingsPillProps = {
  text: string;
};

function highlightValue(text: string) {
  const match = text.match(/€\d+|\d+\s[a-zA-Z]+/);

  if (!match || match.index === undefined) {
    return <Text>{text}</Text>;
  }

  const before = text.slice(0, match.index);
  const value = match[0];
  const after = text.slice(match.index + value.length);

  return (
    <>
      {before}
      <Text style={styles.amount}>{value}</Text>
      {after}
    </>
  );
}

export function SavingsPill({ text }: SavingsPillProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.75}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="tag-outline" size={17} color={colors.primary} />
      </View>
      <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.88}>
        {highlightValue(text)}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
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
    marginTop: 14,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.mint,
    borderRadius: 12,
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    width: 32,
  },
  text: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  amount: {
    color: colors.success,
    fontWeight: "800",
  },
});
