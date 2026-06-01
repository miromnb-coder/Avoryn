import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";

export function MapPreview() {
  return (
    <View style={styles.map}>
      <View style={[styles.park, styles.parkOne]} />
      <View style={[styles.park, styles.parkTwo]} />
      <View style={[styles.road, styles.roadOne]} />
      <View style={[styles.road, styles.roadTwo]} />
      <View style={[styles.road, styles.roadThree]} />
      <View style={[styles.road, styles.roadFour]} />
      <View style={[styles.road, styles.roadFive]} />

      <View style={[styles.pin, styles.foodPin]}>
        <MaterialCommunityIcons name="silverware-fork-knife" size={15} color={colors.card} />
      </View>
      <View style={[styles.pin, styles.shopPin]}>
        <MaterialCommunityIcons name="cart-outline" size={15} color={colors.card} />
      </View>
      <View style={[styles.pin, styles.libraryPin]}>
        <MaterialCommunityIcons name="storefront-outline" size={15} color={colors.card} />
      </View>

      <View style={styles.locationPulse}>
        <View style={styles.locationDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    backgroundColor: "#F0F2EF",
    borderRadius: 17,
    height: 96,
    marginBottom: 10,
    overflow: "hidden",
    position: "relative",
  },
  park: {
    backgroundColor: "#DCEEDA",
    opacity: 0.65,
    position: "absolute",
  },
  parkOne: {
    height: 54,
    left: -6,
    top: 10,
    transform: [{ rotate: "-26deg" }],
    width: 110,
  },
  parkTwo: {
    height: 42,
    right: -10,
    top: 8,
    transform: [{ rotate: "19deg" }],
    width: 90,
  },
  road: {
    backgroundColor: colors.card,
    height: 7,
    opacity: 0.95,
    position: "absolute",
    width: 390,
  },
  roadOne: {
    left: -68,
    top: 20,
    transform: [{ rotate: "-24deg" }],
  },
  roadTwo: {
    left: -30,
    top: 64,
    transform: [{ rotate: "18deg" }],
  },
  roadThree: {
    left: 100,
    top: -10,
    transform: [{ rotate: "88deg" }],
  },
  roadFour: {
    left: -70,
    top: 86,
    transform: [{ rotate: "-3deg" }],
  },
  roadFive: {
    right: -90,
    top: 44,
    transform: [{ rotate: "-38deg" }],
  },
  pin: {
    alignItems: "center",
    borderRadius: 999,
    height: 29,
    justifyContent: "center",
    position: "absolute",
    width: 29,
  },
  foodPin: {
    backgroundColor: colors.success,
    left: 86,
    top: 20,
  },
  shopPin: {
    backgroundColor: "#F5A623",
    right: 118,
    top: 18,
  },
  libraryPin: {
    backgroundColor: "#3478D6",
    right: 54,
    bottom: 19,
  },
  locationPulse: {
    alignItems: "center",
    backgroundColor: "rgba(45, 125, 225, 0.18)",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    left: "48%",
    position: "absolute",
    top: 32,
    width: 44,
  },
  locationDot: {
    backgroundColor: "#2D7DE1",
    borderColor: colors.card,
    borderRadius: 999,
    borderWidth: 4,
    height: 22,
    width: 22,
  },
});
