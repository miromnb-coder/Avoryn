import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPreview } from "../../components/MapPreview";
import { NearbyCard } from "../../components/NearbyCard";
import { colors } from "../../constants/colors";
import { nearbyPlaces } from "../../constants/mockData";
import { useUserLocation } from "../../hooks/useUserLocation";

export default function NearbyScreen() {
  const { location, errorMessage, isLoading, requestLocation } = useUserLocation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>Avoryn</Text>
        <Text style={styles.title}>Useful places near you</Text>
        <Text style={styles.subtitle}>Find nearby places that help you save money, time or effort.</Text>

        <View style={styles.locationCard}>
          <View style={styles.locationIconWrap}>
            <MaterialCommunityIcons name="crosshairs-gps" size={22} color={colors.primary} />
          </View>
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationTitle}>Your location</Text>
            {isLoading ? (
              <Text style={styles.locationText}>Getting your location...</Text>
            ) : location ? (
              <Text style={styles.locationText} numberOfLines={1}>
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.locationText}>{errorMessage ?? "Location is not available."}</Text>
            )}
          </View>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <TouchableOpacity style={styles.refreshButton} activeOpacity={0.75} onPress={requestLocation}>
              <MaterialCommunityIcons name="refresh" size={20} color={colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>

        <MapPreview userLocation={location} height={176} />

        <View style={styles.list}>
          {nearbyPlaces.map((place) => (
            <NearbyCard key={place.name} {...place} />
          ))}
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={28} color={colors.primary} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Real map added</Text>
            <Text style={styles.infoText}>
              Avoryn now asks for location permission and centers the map near you. The places are still demo data.
            </Text>
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
    marginBottom: 16,
    marginTop: 8,
  },
  locationCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    padding: 14,
  },
  locationIconWrap: {
    alignItems: "center",
    backgroundColor: colors.mint,
    borderRadius: 14,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  locationText: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  refreshButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
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
