import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPreview } from "../../components/MapPreview";
import { NearbyCard } from "../../components/NearbyCard";
import { colors } from "../../constants/colors";
import { nearbyPlaces } from "../../constants/mockData";

export default function NearbyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>Avoryn</Text>
        <Text style={styles.title}>Useful places near you</Text>
        <Text style={styles.subtitle}>A simple first version of the nearby screen. The real map can be added later.</Text>

        <MapPreview />

        <View style={styles.list}>
          {nearbyPlaces.map((place) => (
            <NearbyCard key={place.name} {...place} />
          ))}
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="map-search-outline" size={28} color={colors.primary} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Map coming later</Text>
            <Text style={styles.infoText}>Next we can connect a real map and location data when the app foundation works.</Text>
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
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 26,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    marginTop: 8,
  },
  list: {
    gap: 12,
  },
  infoCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
    padding: 16,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  infoText: {
    color: colors.muted,
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 3,
  },
});
