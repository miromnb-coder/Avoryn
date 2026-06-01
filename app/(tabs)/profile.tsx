import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

const stats = [
  { label: "Smarter choices", value: "3", icon: "check-circle-outline" },
  { label: "Estimated saved", value: "€24", icon: "cash-multiple" },
  { label: "Bad deals avoided", value: "2", icon: "shield-check-outline" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>Avoryn</Text>
        <Text style={styles.title}>Your smarter week</Text>
        <Text style={styles.subtitle}>A simple first profile view for showing the value Avoryn gives back.</Text>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <MaterialCommunityIcons name={stat.icon as any} size={25} color={colors.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Recent choices</Text>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineEmoji}>🥗</Text>
            <View style={styles.timelineTextWrap}>
              <Text style={styles.timelineText}>Picked the better lunch option</Text>
              <Text style={styles.timelineMeta}>Saved about €8</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineEmoji}>🛒</Text>
            <View style={styles.timelineTextWrap}>
              <Text style={styles.timelineText}>Waited for an evening discount</Text>
              <Text style={styles.timelineMeta}>Best if you can wait</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineEmoji}>🔎</Text>
            <View style={styles.timelineTextWrap}>
              <Text style={styles.timelineText}>Checked an item before buying</Text>
              <Text style={styles.timelineMeta}>Avoided a bad deal</Text>
            </View>
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
    marginBottom: 32,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    minHeight: 128,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 4,
    textAlign: "center",
  },
  timelineCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 20,
    padding: 18,
  },
  timelineTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 14,
  },
  timelineItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  timelineEmoji: {
    fontSize: 26,
  },
  timelineTextWrap: {
    flex: 1,
  },
  timelineText: {
    color: colors.text,
    fontSize: 14.5,
    fontWeight: "700",
  },
  timelineMeta: {
    color: colors.muted,
    fontSize: 12.5,
    marginTop: 2,
  },
});
