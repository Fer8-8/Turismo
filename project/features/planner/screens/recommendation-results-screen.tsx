import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { FullPageContainer } from "@/components/full-page-container";
import { ScrollContainer } from "@/components/scroll-container";
import { Text } from "@/components/ui/text";
import { SectionHeader } from "@/features/home/components/section-header";
import { useGetAllPlacesByState } from "@/features/places/api/get-all-places-by-state";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SPACING } from "@/lib/theme";
import { PlaceCard } from "../components/place-card";
import { usePlannerStore } from "../store/planner-store";

export function RecommendationResultsScreen() {
  const { t } = useTranslation();
  const {
    selectedStateId,
    selectedStateName,
    selectedPlaceIds,
    toggleSelectedPlace,
    setInitialPlaces,
  } = usePlannerStore();
  const { data, isLoading } = useGetAllPlacesByState(selectedStateId);
  const places = useMemo(() => data?.places || [], [data]);

  useEffect(() => {
    if (places.length > 0) {
      setInitialPlaces(places.map((p) => p.id));
    }
  }, [places, setInitialPlaces]);

  const groupedPlaces = places.reduce(
    (acc, place) => {
      const stateName = place.state?.name || "Sin estado";
      if (!acc[stateName]) {
        acc[stateName] = [];
      }
      if (acc[stateName].length < 10) {
        acc[stateName].push(place);
      }
      return acc;
    },
    {} as Record<string, typeof places>
  );

  if (isLoading) {
    return (
      <View style={{ marginBottom: 20 }}>
        <SectionHeader title="Cargando lugares..." />
      </View>
    );
  }

  return (
    <FullPageContainer style={styles.container}>
      <Text style={styles.mainTitle} variant="subtitle">
        {selectedStateName
          ? `Lugares en ${selectedStateName}`
          : t("recommendations.title")}
      </Text>

      <ScrollContainer>
        {Object.entries(groupedPlaces).map(([stateName, items]) => (
          <View key={stateName} style={styles.section}>
            <View style={styles.cardsContainer}>
              {items.map((place, index) => (
                <PlaceCard
                  category={place.category?.category || ""}
                  imageUri={{
                    uri: place.medias?.[0]?.url || IMAGE_PLACEHOLDER,
                  }}
                  key={place.id}
                  number={index + 1}
                  onSelect={() => toggleSelectedPlace(place.id)}
                  selected={selectedPlaceIds.includes(place.id)}
                  title={place.name}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollContainer>
    </FullPageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.sm,
  },
  mainTitle: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  cardsContainer: {
    gap: SPACING.md,
  },
});
