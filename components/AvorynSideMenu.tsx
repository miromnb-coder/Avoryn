import { StyleSheet, View } from "react-native";

export function AvorynSideMenu() {
  return (
    <View style={styles.background}>
      <View style={styles.content} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(255,255,255,0.78)",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 88,
  },
});
