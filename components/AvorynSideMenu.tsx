import { ImageBackground, StyleSheet, View } from "react-native";

export function AvorynSideMenu() {
  return (
    <ImageBackground
      source={require("../assets/backgrounds/avoryn-background.PNG")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.content} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 88,
  },
});
