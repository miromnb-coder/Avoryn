import { ImageBackground, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AvorynComposer } from "../components/AvorynComposer";
import { AvorynDrawerShell } from "../components/AvorynDrawerShell";
import { AvorynHeader } from "../components/AvorynHeader";
import { colors } from "../constants/colors";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

function AvorynHomeContent({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <ImageBackground
      source={require("../assets/backgrounds/avoryn-background.PNG")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <AvorynHeader onMenuPress={onMenuPress} />

          <View style={styles.hero}>
            <Text style={styles.title}>What are you{`\n`}trying to do?</Text>
            <View style={styles.composerSlot}>
              <AvorynComposer />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export function AvorynHomeScreen() {
  return <AvorynDrawerShell>{({ openDrawer }) => <AvorynHomeContent onMenuPress={openDrawer} />}</AvorynDrawerShell>;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: "transparent",
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 0,
  },
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 104,
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: -1.15,
    lineHeight: 48,
    marginBottom: 58,
    textAlign: "center",
  },
  composerSlot: {
    height: 174,
    justifyContent: "flex-end",
    width: "100%",
  },
});
