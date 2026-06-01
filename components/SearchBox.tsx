import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

type SearchBoxProps = {
  query: string;
};

export function SearchBox({ query }: SearchBoxProps) {
  return (
    <View>
      <Text style={styles.title}>What are you trying to do?</Text>
      <View style={styles.searchBox}>
        <Text style={styles.placeholder} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86}>
          {query}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialCommunityIcons name="microphone-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialCommunityIcons name="line-scan" size={23} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.65,
    marginBottom: 14,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  placeholder: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginLeft: 12,
  },
  divider: {
    backgroundColor: colors.border,
    height: 26,
    width: 1,
  },
});
