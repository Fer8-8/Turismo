import { StyleSheet, View } from "react-native";
import { SPACING } from "@/lib/theme";
import {
  AmenitiesCard,
  type AmenityItem,
  AvoidSeasonsCard,
  BestSeasonsCard,
  CrowdLevelCard,
  IdealMonthsCard,
  PriceLevelCard,
  RequirementsCard,
  VisitAverageCard,
} from "./detail-cards";

type ArchaeologicalZoneDetailsProps = {
  requiresGuide?: boolean | null;
  requiresPermit?: boolean | null;
  typicalVisitHours?: number | null;
  recommendedDays?: number | null;
  crowdLevel?: string | null;
  priceLevel?: string | null;
  wheelchairAccessible?: boolean | null;
  hasParking?: boolean | null;
  bestSeasons?: string[] | null;
  avoidSeasons?: string[] | null;
  idealMonths?: string[] | null;
};

export function ArchaeologicalZoneDetails({
  requiresGuide,
  requiresPermit,
  typicalVisitHours,
  recommendedDays,
  crowdLevel,
  priceLevel,
  wheelchairAccessible,
  hasParking,
  bestSeasons,
  avoidSeasons,
  idealMonths,
}: ArchaeologicalZoneDetailsProps) {
  const requirements = [
    requiresPermit && {
      icon: "document-text-outline",
      label: "Requiere permiso",
    },
    requiresGuide && { icon: "people-outline", label: "Requiere guía" },
  ].filter(Boolean) as AmenityItem[];

  const amenities = [
    wheelchairAccessible && { icon: "accessibility", label: "Accesible" },
    hasParking && { icon: "car", label: "Estacionamiento" },
  ].filter(Boolean) as AmenityItem[];

  return (
    <View style={styles.container}>
      <RequirementsCard items={requirements} />
      <VisitAverageCard
        recommendedDays={recommendedDays}
        typicalVisitHours={typicalVisitHours}
      />
      <PriceLevelCard priceLevel={priceLevel} />
      <BestSeasonsCard bestSeasons={bestSeasons} />
      <AvoidSeasonsCard avoidSeasons={avoidSeasons} />
      <IdealMonthsCard idealMonths={idealMonths} />
      <AmenitiesCard items={amenities} />
      <CrowdLevelCard crowdLevel={crowdLevel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
});
