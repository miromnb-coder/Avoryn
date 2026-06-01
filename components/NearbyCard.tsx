import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

type NearbyCardProps = {
  name: string;
  rating: string;
  detail: string;
  meta: string;
  emoji?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export function NearbyCard({ name, rating, detail, meta, emoji, icon = "map-marker-outline" }: NearbyCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.78}>
      <View style={styles.thumbnail}>
        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : (
          <MaterialCommunityIcons name={icon} size={26} color={colors.primary} />
        )}
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
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 76,
    padding: 7,
  },
  thumbnail: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 62,
    justifyContent: "center",
    width: 62,
  },
  emoji: {
    fontSize: 27,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  name: {
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "800",
  },
  rating: {
    color: colors.success,
    fontSize: 11.5,
    fontWeight: "800",
    marginTop: 1,
  },
  detail: {
    color: colors.text,
    fontSize: 11,
    marginTop: 1,
  },
  meta: {
    color: colors.muted,
    fontSize: 10.5,
    marginTop: 1,
  },
});
