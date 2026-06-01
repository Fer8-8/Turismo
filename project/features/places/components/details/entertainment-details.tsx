import { StyleSheet, View } from "react-native";
import { SPACING } from "@/lib/theme";
import {
  AmenitiesCard,
  type AmenityItem,
  CrowdLevelCard,
  PriceLevelCard,
  VisitAverageCard,
} from "./detail-cards";

type EntertainmentDetailsProps = {
  hasNightlife?: boolean | null;
  priceLevel?: string | null;
  crowdLevel?: string | null;
  typicalVisitHours?: number | null;
  wheelchairAccessible?: boolean | null;
  hasParking?: boolean | null;
  petFriendly?: boolean | null;
};

export function EntertainmentDetails({
  hasNightlife,
  priceLevel,
  crowdLevel,
  typicalVisitHours,
  wheelchairAccessible,
  hasParking,
  petFriendly,
}: EntertainmentDetailsProps) {
  const amenities = [
    hasNightlife && { icon: "moon-outline", label: "Vida nocturna" },
    wheelchairAccessible && { icon: "accessibility", label: "Accesible" },
    hasParking && { icon: "car", label: "Estacionamiento" },
    petFriendly && { icon: "paw", label: "Pet friendly" },
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
