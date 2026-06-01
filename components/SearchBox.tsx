import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

export function SearchBox() {
  return (
    <View>
      <Text style={styles.title}>What are you trying to do?</Text>
      <View style={styles.searchBox}>
        <Text style={styles.placeholder}>I need a smarter way to get lunch</Text>
        <View style={styles.actions}>
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialCommunityIcons name="microphone-outline" size={23} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialCommunityIcons name="line-scan" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.primaryDark,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.7,
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
    minHeight: 58,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  placeholder: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginLeft: 12,
  },
  divider: {
    backgroundColor: colors.border,
    height: 28,
    width: 1,
  },
});
