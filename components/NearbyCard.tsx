import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

type NearbyCardProps = {
  name: string;
  rating: string;
  detail: string;
  meta: string;
  emoji: string;
};

export function NearbyCard({ name, rating, detail, meta, emoji }: NearbyCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.78}>
      <View style={styles.thumbnail}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.rating}>★ {rating}</Text>
        <Text style={styles.detail} numberOfLines={1}>{detail}</Text>
        <Text style={styles.meta} numberOfLines={1}>{meta}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 92,
    padding: 9,
  },
  thumbnail: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 15,
    height: 74,
    justifyContent: "center",
    width: 74,
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  rating: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2,
  },
  detail: {
    color: colors.text,
    fontSize: 12.5,
    marginTop: 2,
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
