import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AvorynComposer } from "../components/AvorynComposer";
import { AvorynHeader } from "../components/AvorynHeader";
import { colors } from "../constants/colors";

export function AvorynHomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <AvorynHeader />

        <View style={styles.hero}>
          <Text style={styles.title}>What are you{`\n`}trying to do?</Text>
          <AvorynComposer />
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
    paddingTop: 10,
  },
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 104,
  },
  title: {
    color: colors.text,
    fontFamily: "serif",
    fontSize: 43,
    fontWeight: "400",
    letterSpacing: -1.35,
    lineHeight: 51,
    marginBottom: 59,
    textAlign: "center",
  },
});
