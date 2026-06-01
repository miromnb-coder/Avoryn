import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const hasPermission = Boolean(permission?.granted);

  const openScanner = async () => {
    setScannedCode(null);

    if (!hasPermission) {
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }

    setIsScannerOpen(true);
  };

  if (isScannerOpen) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.scannerContent}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity style={styles.closeButton} activeOpacity={0.75} onPress={() => setIsScannerOpen(false)}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.scannerLogo}>Avoryn</Text>
            <View style={styles.closeButton} />
          </View>

          <Text style={styles.scannerTitle}>Point at a barcode</Text>
          <Text style={styles.scannerSubtitle}>Avoryn will read the code and show a first demo result.</Text>

          <View style={styles.cameraFrame}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr"],
              }}
              onBarcodeScanned={({ data }) => {
                if (!scannedCode) {
                  setScannedCode(data);
                }
              }}
            />
            <View style={styles.scanGuide} />
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{scannedCode ? "Barcode detected" : "Waiting for scan"}</Text>
            <Text style={styles.resultText}>
              {scannedCode
                ? `Code: ${scannedCode}. Next we can connect this to product and price data.`
                : "Hold the barcode inside the square. Good lighting helps."}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>Avoryn</Text>

        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="barcode-scan" size={54} color={colors.card} />
        </View>

        <Text style={styles.title}>Scan before you buy</Text>
        <Text style={styles.subtitle}>Use the camera to scan a barcode and start checking if a product is worth buying.</Text>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={openScanner}>
          <MaterialCommunityIcons name="camera-outline" size={22} color={colors.card} />
          <Text style={styles.primaryButtonText}>Open scanner</Text>
        </TouchableOpacity>

        {permission && !hasPermission ? (
          <Text style={styles.permissionText}>Camera permission is needed to scan products.</Text>
        ) : null}

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
  permissionText: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
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
  scannerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  scannerHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  closeButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  scannerLogo: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: "800",
  },
  scannerTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  scannerSubtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    marginTop: 8,
  },
  cameraFrame: {
    backgroundColor: colors.text,
    borderRadius: 28,
    height: 390,
    overflow: "hidden",
    position: "relative",
  },
  scanGuide: {
    alignSelf: "center",
    borderColor: colors.card,
    borderRadius: 24,
    borderWidth: 3,
    height: 190,
    marginTop: 95,
    opacity: 0.88,
    width: 220,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 18,
    padding: 18,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  resultText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
});
