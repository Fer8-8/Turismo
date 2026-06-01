import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/badge";
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
  RequirementsCard,
  TemperatureCard,
  VisitAverageCard,
} from "./detail-cards";
import { ENVIRONMENT_TYPE_LABEL } from "./detail-utils";

type NatureDetailsProps = {
  environmentType?: string | null;
  requiresPermit?: boolean | null;
  requiresGuide?: boolean | null;
  avgTempWinterCelsius?: number | null;
  avgTempSummerCelsius?: number | null;
  typicalVisitHours?: number | null;
  recommendedDays?: number | null;
  estimatedDailyCostMin?: number | null;
  estimatedDailyCostMax?: number | null;
  accommodationAvgCost?: number | null;
  hasParking?: boolean | null;
  petFriendly?: boolean | null;
  crowdLevel?: string | null;
  bestSeasons?: string[] | null;
  avoidSeasons?: string[] | null;
  idealMonths?: string[] | null;
};

export function NatureDetails({
  environmentType,
  requiresPermit,
  requiresGuide,
  avgTempWinterCelsius,
  avgTempSummerCelsius,
  typicalVisitHours,
  recommendedDays,
  estimatedDailyCostMin,
  estimatedDailyCostMax,
  accommodationAvgCost,
  hasParking,
  petFriendly,
  crowdLevel,
  bestSeasons,
  avoidSeasons,
  idealMonths,
}: NatureDetailsProps) {
  const requirements = [
    requiresPermit && {
      icon: "document-text-outline",
      label: "Requiere permiso",
    },
    requiresGuide && { icon: "people-outline", label: "Requiere guía" },
  ].filter(Boolean) as AmenityItem[];

  const amenities = [
    hasParking && { icon: "car", label: "Estacionamiento" },
    petFriendly && { icon: "paw", label: "Pet friendly" },
  ].filter(Boolean) as AmenityItem[];

  return (
    <View style={styles.container}>
      <RequirementsCard items={requirements} />
      <VisitAverageCard
        recommendedDays={recommendedDays}
        typicalVisitHours={typicalVisitHours}
      />
      {environmentType && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name="leaf-outline"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Entorno
              </Text>
            </View>
            <Badge
              color="#2D7D46"
              label={ENVIRONMENT_TYPE_LABEL[environmentType] ?? environmentType}
            />
          </View>
        </Card>
      )}
      <TemperatureCard
        avgTempSummerCelsius={avgTempSummerCelsius}
        avgTempWinterCelsius={avgTempWinterCelsius}
      />
      <DailyCostCard
        estimatedDailyCostMax={estimatedDailyCostMax}
        estimatedDailyCostMin={estimatedDailyCostMin}
      />
      <AccommodationCostCard accommodationAvgCost={accommodationAvgCost} />
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
