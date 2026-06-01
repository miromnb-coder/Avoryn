import { useMemo, useState } from "react";
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
import { categoryChips, ScenarioId, scenarios } from "../../constants/mockData";

export default function AskScreen() {
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>("buy");
  const activeScenario = useMemo(() => scenarios[activeScenarioId], [activeScenarioId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader />
        <SearchBox query={activeScenario.query} />

        <View style={styles.chipRow}>
          {categoryChips.map((chip) => (
            <CategoryChip
              key={chip.id}
              label={chip.label}
              icon={chip.icon}
              isActive={chip.id === activeScenarioId}
              onPress={() => setActiveScenarioId(chip.id)}
            />
          ))}
        </View>

        <SavingsPill text={activeScenario.savingsText} />

        <SectionTitle title="Your smarter options" subtitle="Compared by cost, distance, time and value" />
        {activeScenario.options.map((option) => (
          <OptionCard key={`${activeScenarioId}-${option.title}`} {...option} />
        ))}

        <View style={styles.nearbyHeader}>
          <SectionTitle title="Near you" icon="map-marker-outline" />
          <Text style={styles.seeAll}>See all ›</Text>
        </View>
        <MapPreview />

        <View style={styles.nearbyCards}>
          {activeScenario.nearby.map((place) => (
            <NearbyCard key={`${activeScenarioId}-${place.name}`} {...place} />
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
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  nearbyHeader: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seeAll: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 14,
  },
  nearbyCards: {
    flexDirection: "row",
    gap: 9,
  },
});
