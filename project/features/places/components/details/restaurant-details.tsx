import { Ionicons, Octicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { parseStringSchedule } from "@/lib/string";
import { SPACING, THEME } from "@/lib/theme";
import {
  AmenitiesCard,
  type AmenityItem,
  CrowdLevelCard,
  PriceLevelCard,
} from "./detail-cards";

type RestaurantDetailsProps = {
  hasVeganOptions?: boolean | null;
  hasVegetarianOptions?: boolean | null;
  hasGlutenFree?: boolean | null;
  cuisineTypes?: string[] | null;
  culinarySpeciality?: string;
  foodAvgCost?: number | null;
  wheelchairAccessible?: boolean | null;
  hasParking?: boolean | null;
  petFriendly?: boolean | null;
  crowdLevel?: string | null;
  priceLevel?: string | null;
  schedule?: string;
};

export function RestaurantDetails({
  hasVeganOptions,
  hasVegetarianOptions,
  hasGlutenFree,
  cuisineTypes,
  culinarySpeciality,
  foodAvgCost,
  wheelchairAccessible,
  hasParking,
  petFriendly,
  crowdLevel,
  priceLevel,
  schedule,
}: RestaurantDetailsProps) {
  const parsed = schedule ? parseStringSchedule(schedule) : null;

  const allBadges = [
    ...(cuisineTypes?.map((c) => ({ label: c, color: "#0A4B8C" })) ?? []),
    culinarySpeciality ? { label: culinarySpeciality, color: "#6B4FA0" } : null,
    hasVeganOptions ? { label: "Vegano", color: "#2D7D46" } : null,
    hasVegetarianOptions ? { label: "Vegetariano", color: "#5A9E3A" } : null,
    hasGlutenFree ? { label: "Sin Gluten", color: "#C47B1A" } : null,
  ].filter(Boolean) as { label: string; color: string }[];

  const amenities = [
    wheelchairAccessible && { icon: "accessibility", label: "Accesible" },
    hasParking && { icon: "car", label: "Estacionamiento" },
    petFriendly && { icon: "paw", label: "Pet friendly" },
  ].filter(Boolean) as AmenityItem[];

  return (
    <View style={styles.container}>
      {parsed && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Octicons
                color={THEME["foreground-muted"]}
                name="clock"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Horario
              </Text>
            </View>
            <View style={styles.right}>
              <Text variant="bodySmall">{parsed.days}</Text>
              <Text color="muted" variant="bodySmall">
                ·
              </Text>
              <Text color="title" variant="bodySmall">
                {parsed.hours}
              </Text>
            </View>
          </View>
        </Card>
      )}
      {allBadges.length > 0 && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name="restaurant"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Cocina
              </Text>
            </View>
            <View style={styles.badgeCloud}>
              {allBadges.map((b) => (
                <Badge color={b.color} key={b.label} label={b.label} />
              ))}
            </View>
          </View>
        </Card>
      )}
      {foodAvgCost != null && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Octicons
                color={THEME["foreground-muted"]}
                name="credit-card"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Costo promedio
              </Text>
            </View>
            <Text color="title" variant="bodySmall">
              ${foodAvgCost} MXN
            </Text>
          </View>
        </Card>
      )}
      <PriceLevelCard priceLevel={priceLevel} />
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
  right: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  badgeCloud: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: SPACING.xs,
  },
});
