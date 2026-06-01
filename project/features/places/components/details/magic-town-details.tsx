import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";
import {
  AccommodationCostCard,
  AmenitiesCard,
  type AmenityItem,
  AvoidSeasonsCard,
  BestSeasonsCard,
  CrowdLevelCard,
  DailyCostCard,
  IdealMonthsCard,
  VisitAverageCard,
} from "./detail-cards";

type MagicTownDetailsProps = {
  foodAvgCost?: number | null;
  accommodationAvgCost?: number | null;
  estimatedDailyCostMin?: number | null;
  estimatedDailyCostMax?: number | null;
  typicalVisitHours?: number | null;
  recommendedDays?: number | null;
  petFriendly?: boolean | null;
  crowdLevel?: string | null;
  bestSeasons?: string[] | null;
  avoidSeasons?: string[] | null;
  idealMonths?: string[] | null;
};

export function MagicTownDetails({
  foodAvgCost,
  accommodationAvgCost,
  estimatedDailyCostMin,
  estimatedDailyCostMax,
  typicalVisitHours,
  recommendedDays,
  petFriendly,
  crowdLevel,
  bestSeasons,
  avoidSeasons,
  idealMonths,
}: MagicTownDetailsProps) {
  const amenities = [
    petFriendly && { icon: "paw", label: "Pet friendly" },
  ].filter(Boolean) as AmenityItem[];

  return (
    <View style={styles.container}>
      <VisitAverageCard
        recommendedDays={recommendedDays}
        typicalVisitHours={typicalVisitHours}
      />
      {foodAvgCost != null && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name="restaurant-outline"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Comida promedio
              </Text>
            </View>
            <Text color="title" variant="bodySmall">
              ${foodAvgCost} MXN
            </Text>
          </View>
        </Card>
      )}
      <AccommodationCostCard accommodationAvgCost={accommodationAvgCost} />
      <DailyCostCard
        estimatedDailyCostMax={estimatedDailyCostMax}
        estimatedDailyCostMin={estimatedDailyCostMin}
      />
      <BestSeasonsCard bestSeasons={bestSeasons} />
      <AvoidSeasonsCard avoidSeasons={avoidSeasons} />
      <IdealMonthsCard idealMonths={idealMonths} />
      <AmenitiesCard items={amenities} />
      <CrowdLevelCard crowdLevel={crowdLevel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.sm },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  label: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
});
