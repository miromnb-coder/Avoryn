import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function ScanScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>Avoryn</Text>

        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="barcode-scan" size={54} color={colors.card} />
        </View>

        <Text style={styles.title}>Scan before you buy</Text>
        <Text style={styles.subtitle}>
          This first version keeps the scanner simple. Later we can add the real camera and barcode scanning.
        </Text>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <MaterialCommunityIcons name="camera-outline" size={22} color={colors.card} />
          <Text style={styles.primaryButtonText}>Open scanner</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Avoryn will check</Text>
          <View style={styles.row}>
            <MaterialCommunityIcons name="currency-eur" size={22} color={colors.primary} />
            <Text style={styles.rowText}>Is this a good price?</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="compare-horizontal" size={22} color={colors.primary} />
            <Text style={styles.rowText}>Are there better options nearby?</Text>
          </View>
          <View style={styles.row}>
            <MaterialCommunityIcons name="timer-sand" size={22} color={colors.primary} />
            <Text style={styles.rowText}>Should you buy now or wait?</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 52,
    textAlign: "center",
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: 34,
    height: 110,
    justifyContent: "center",
    marginBottom: 24,
    width: 110,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 310,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    borderRadius: 999,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 26,
    minHeight: 54,
    paddingHorizontal: 24,
    width: "100%",
  },
  primaryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "800",
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 24,
    padding: 18,
    width: "100%",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  rowText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
});
