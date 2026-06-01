import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";

export function MapPreview() {
  return (
    <View style={styles.map}>
      <View style={[styles.road, styles.roadOne]} />
      <View style={[styles.road, styles.roadTwo]} />
      <View style={[styles.road, styles.roadThree]} />
      <View style={[styles.road, styles.roadFour]} />

      <View style={[styles.pin, styles.foodPin]}>
        <MaterialCommunityIcons name="silverware-fork-knife" size={18} color={colors.card} />
      </View>
      <View style={[styles.pin, styles.shopPin]}>
        <MaterialCommunityIcons name="cart-outline" size={18} color={colors.card} />
      </View>
      <View style={[styles.pin, styles.libraryPin]}>
        <MaterialCommunityIcons name="book-open-variant" size={18} color={colors.card} />
      </View>

      <View style={styles.locationPulse}>
        <View style={styles.locationDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    backgroundColor: "#EFF3EF",
    borderRadius: 18,
    height: 118,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
  },
  road: {
    backgroundColor: colors.card,
    height: 9,
    opacity: 0.9,
    position: "absolute",
    width: 420,
  },
  roadOne: {
    left: -70,
    top: 22,
    transform: [{ rotate: "-24deg" }],
  },
  roadTwo: {
    left: -30,
    top: 72,
    transform: [{ rotate: "18deg" }],
  },
  roadThree: {
    left: 120,
    top: 0,
    transform: [{ rotate: "89deg" }],
  },
  roadFour: {
    left: -80,
    top: 102,
    transform: [{ rotate: "-3deg" }],
  },
  pin: {
    alignItems: "center",
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    width: 34,
  },
  foodPin: {
    backgroundColor: colors.success,
    left: 94,
    top: 28,
  },
  shopPin: {
    backgroundColor: "#F5A623",
    right: 118,
    top: 25,
  },
  libraryPin: {
    backgroundColor: "#3478D6",
    right: 58,
    bottom: 24,
  },
  locationPulse: {
    alignItems: "center",
    backgroundColor: "rgba(45, 125, 225, 0.18)",
    borderRadius: 999,
    height: 54,
    justifyContent: "center",
    left: "48%",
    position: "absolute",
    top: 42,
    width: 54,
  },
  locationDot: {
    backgroundColor: "#2D7DE1",
    borderColor: colors.card,
    borderRadius: 999,
    borderWidth: 4,
    height: 24,
    width: 24,
  },
});
