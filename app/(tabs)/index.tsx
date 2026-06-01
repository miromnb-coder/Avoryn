import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { CategoryChip } from "../../components/CategoryChip";
import { MapPreview } from "../../components/MapPreview";
import { NearbyCard } from "../../components/NearbyCard";
import { OptionCard } from "../../components/OptionCard";
import { SavingsPill } from "../../components/SavingsPill";
import { ScanCallout } from "../../components/ScanCallout";
import { SearchBox } from "../../components/SearchBox";
import { SectionTitle } from "../../components/SectionTitle";
import { colors } from "../../constants/colors";
import { categoryChips, nearbyPlaces, smarterOptions } from "../../constants/mockData";

export default function AskScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader />
        <SearchBox />

        <View style={styles.chipRow}>
          {categoryChips.map((chip) => (
            <CategoryChip key={chip.label} label={chip.label} icon={chip.icon} />
          ))}
        </View>

        <SavingsPill />

        <SectionTitle title="Your smarter options" subtitle="Compared by cost, distance, time and value" />
        {smarterOptions.map((option) => (
          <OptionCard key={option.title} {...option} />
        ))}

        <View style={styles.nearbyHeader}>
          <SectionTitle title="Near you" icon="map-marker-outline" />
          <Text style={styles.seeAll}>See all ›</Text>
        </View>
        <MapPreview />

        <View style={styles.nearbyCards}>
          {nearbyPlaces.map((place) => (
            <NearbyCard key={place.name} {...place} />
          ))}
        </View>

        <ScanCallout />
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
    paddingTop: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 16,
  },
  nearbyHeader: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seeAll: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 16,
  },
  nearbyCards: {
    flexDirection: "row",
    gap: 10,
  },
});
