import { StyleSheet, View } from "react-native";
import { SPACING } from "@/lib/theme";
import {
  AmenitiesCard,
  type AmenityItem,
  CrowdLevelCard,
  PriceLevelCard,
  VisitAverageCard,
} from "./detail-cards";

type CultureDetailsProps = {
  typicalVisitHours?: number | null;
  priceLevel?: string | null;
  crowdLevel?: string | null;
  wheelchairAccessible?: boolean | null;
};

export function CultureDetails({
  typicalVisitHours,
  priceLevel,
  crowdLevel,
  wheelchairAccessible,
}: CultureDetailsProps) {
  const amenities = [
    wheelchairAccessible && { icon: "accessibility", label: "Accesible" },
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
