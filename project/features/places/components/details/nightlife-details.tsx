import { StyleSheet, View } from "react-native";
import { SPACING } from "@/lib/theme";
import {
  AmenitiesCard,
  type AmenityItem,
  CrowdLevelCard,
  PriceLevelCard,
  VisitAverageCard,
} from "./detail-cards";

type NightlifeDetailsProps = {
  hasNightlife?: boolean | null;
  crowdLevel?: string | null;
  priceLevel?: string | null;
  typicalVisitHours?: number | null;
  wheelchairAccessible?: boolean | null;
  hasParking?: boolean | null;
};

export function NightlifeDetails({
  hasNightlife,
  crowdLevel,
  priceLevel,
  typicalVisitHours,
  wheelchairAccessible,
  hasParking,
}: NightlifeDetailsProps) {
  const amenities = [
    hasNightlife && { icon: "moon-outline", label: "Vida nocturna" },
    wheelchairAccessible && { icon: "accessibility", label: "Accesible" },
    hasParking && { icon: "car", label: "Estacionamiento" },
  ].filter(Boolean) as AmenityItem[];

  return (
    <View style={styles.container}>
      <VisitAverageCard typicalVisitHours={typicalVisitHours} />
      <PriceLevelCard priceLevel={priceLevel} />
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
