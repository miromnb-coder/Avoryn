import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function AskScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.blank} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  blank: {
    flex: 1,
  },
});
