import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { UserLocation } from "../hooks/useUserLocation";

type MapPreviewProps = {
  userLocation?: UserLocation | null;
  height?: number;
};

const defaultLocation: UserLocation = {
  latitude: 60.1699,
  longitude: 24.9384,
};

function buildRegion(location: UserLocation): Region {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };
}

function nearbyMarkers(center: UserLocation) {
  return [
    {
      id: "food",
      coordinate: {
        latitude: center.latitude + 0.0022,
        longitude: center.longitude - 0.0025,
      },
      icon: "silverware-fork-knife" as const,
      color: colors.success,
      title: "Food option",
    },
    {
      id: "shop",
      coordinate: {
        latitude: center.latitude + 0.0016,
        longitude: center.longitude + 0.0024,
      },
      icon: "cart-outline" as const,
      color: "#F5A623",
      title: "Store deal",
    },
    {
      id: "place",
      coordinate: {
        latitude: center.latitude - 0.0018,
        longitude: center.longitude + 0.0031,
      },
      icon: "storefront-outline" as const,
      color: "#3478D6",
      title: "Useful place",
    },
  ];
}

export function MapPreview({ userLocation, height = 96 }: MapPreviewProps) {
  const center = userLocation ?? defaultLocation;
  const region = buildRegion(center);

  return (
    <View style={[styles.container, { height }]}> 
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        region={region}
        showsUserLocation={Boolean(userLocation)}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {nearbyMarkers(center).map((marker) => (
          <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title}>
            <View style={[styles.marker, { backgroundColor: marker.color }]}> 
              <MaterialCommunityIcons name={marker.icon} size={15} color={colors.card} />
            </View>
          </Marker>
        ))}

        {!userLocation ? (
          <Marker coordinate={center} title="Demo location">
            <View style={styles.userPulse}>
              <View style={styles.userDot} />
            </View>
          </Marker>
        ) : null}
      </MapView>

      {!userLocation ? (
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>Demo map</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F2EF",
    borderRadius: 17,
    marginBottom: 10,
    overflow: "hidden",
    position: "relative",
  },
  marker: {
    alignItems: "center",
    borderColor: colors.card,
    borderRadius: 999,
    borderWidth: 2,
    height: 32,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    width: 32,
  },
  userPulse: {
    alignItems: "center",
    backgroundColor: "rgba(45, 125, 225, 0.18)",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  userDot: {
    backgroundColor: "#2D7DE1",
    borderColor: colors.card,
    borderRadius: 999,
    borderWidth: 4,
    height: 22,
    width: 22,
  },
  demoBadge: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute",
    top: 10,
  },
  demoBadgeText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
});
