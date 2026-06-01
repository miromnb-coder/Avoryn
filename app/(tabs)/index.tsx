import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function AskScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.72}>
            <MaterialCommunityIcons name="menu" size={28} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.logo}>Avoryn</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>What are you{`\n`}trying to do?</Text>

          <View style={styles.composerCard}>
            <View style={styles.inputLine}>
              <View style={styles.caret} />
              <Text style={styles.placeholder}>Ask Avoryn anything</Text>
            </View>

            <View style={styles.composerActions}>
              <TouchableOpacity style={styles.subtleCircleButton} activeOpacity={0.68}>
                <MaterialCommunityIcons name="plus" size={27} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.rightActions}>
                <TouchableOpacity style={styles.subtleCircleButton} activeOpacity={0.68}>
                  <MaterialCommunityIcons name="line-scan" size={21} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.subtleCircleButton} activeOpacity={0.68}>
                  <MaterialCommunityIcons name="microphone-outline" size={23} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.subtleCircleButton, styles.disabledSend]} activeOpacity={0.68}>
                  <MaterialCommunityIcons name="arrow-up" size={22} color={colors.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
  },
  iconButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  logo: {
    color: colors.text,
    fontFamily: "serif",
    fontSize: 31,
    fontWeight: "500",
    letterSpacing: -0.4,
  },
  headerSpacer: {
    width: 44,
  },
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 112,
  },
  title: {
    color: colors.text,
    fontFamily: "serif",
    fontSize: 42,
    fontWeight: "400",
    letterSpacing: -1.35,
    lineHeight: 50,
    marginBottom: 58,
    textAlign: "center",
  },
  composerCard: {
    backgroundColor: colors.composer,
    borderColor: colors.composerBorder,
    borderRadius: 23,
    borderWidth: 1,
    minHeight: 138,
    paddingBottom: 17,
    paddingHorizontal: 18,
    paddingTop: 21,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    width: "100%",
  },
  inputLine: {
    alignItems: "center",
    flexDirection: "row",
  },
  caret: {
    backgroundColor: "#7EA0F2",
    borderRadius: 999,
    height: 31,
    marginRight: 3,
    width: 3,
  },
  placeholder: {
    color: colors.placeholder,
    flex: 1,
    fontSize: 20,
    fontWeight: "400",
  },
  composerActions: {
    alignItems: "flex-end",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  subtleCircleButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.54)",
    borderColor: "rgba(7,59,58,0.08)",
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  disabledSend: {
    backgroundColor: "rgba(7,59,58,0.055)",
  },
});
