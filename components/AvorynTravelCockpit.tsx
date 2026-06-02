import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";

export function AvorynTravelCockpit() {
  return <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.drawerBackground,
    flex: 1,
  },
});
