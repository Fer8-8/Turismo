import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";
import {
  AmenitiesCard,
  type AmenityItem,
  AvoidSeasonsCard,
  BestSeasonsCard,
  CrowdLevelCard,
  DailyCostCard,
  IdealMonthsCard,
  TemperatureCard,
} from "./detail-cards";
import {
  BEACH_TYPE_LABEL,
  DEVELOPMENT_LEVEL_LABEL,
  SAND_COLOR_LABEL,
  WAVE_TYPE_LABEL,
} from "./detail-utils";

type BeachDetailsProps = {
  beachType?: string | null;
  sandColor?: string | null;
  waveType?: string | null;
  hasReef?: boolean | null;
  developmentLevel?: string | null;
  avgTempWinterCelsius?: number | null;
  avgTempSummerCelsius?: number | null;
  estimatedDailyCostMin?: number | null;
  estimatedDailyCostMax?: number | null;
  wheelchairAccessible?: boolean | null;
  hasParking?: boolean | null;
  petFriendly?: boolean | null;
  crowdLevel?: string | null;
  bestSeasons?: string[] | null;
  avoidSeasons?: string[] | null;
  idealMonths?: string[] | null;
};

export function BeachDetails({
  beachType,
  sandColor,
  waveType,
  hasReef,
  developmentLevel,
  avgTempWinterCelsius,
  avgTempSummerCelsius,
  estimatedDailyCostMin,
  estimatedDailyCostMax,
  wheelchairAccessible,
  hasParking,
  petFriendly,
  crowdLevel,
  bestSeasons,
  avoidSeasons,
  idealMonths,
}: BeachDetailsProps) {
  const amenities = [
    hasReef && { icon: "fish-outline", label: "Arrecife" },
    wheelchairAccessible && { icon: "accessibility", label: "Accesible" },
    hasParking && { icon: "car", label: "Estacionamiento" },
    petFriendly && { icon: "paw", label: "Pet friendly" },
  ].filter(Boolean) as AmenityItem[];

  return (
    <View style={styles.container}>
      {beachType && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name="umbrella-outline"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Tipo de playa
              </Text>
            </View>
            <Badge
              color="#0A4B8C"
              label={BEACH_TYPE_LABEL[beachType] ?? beachType}
            />
          </View>
        </Card>
      )}
      {sandColor && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name="color-palette-outline"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Arena
              </Text>
            </View>
            <Badge
              color="#C47B1A"
              label={SAND_COLOR_LABEL[sandColor] ?? sandColor}
            />
          </View>
        </Card>
      )}
      {waveType && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name="water-outline"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Oleaje
              </Text>
            </View>
            <Badge
              color="#0A4B8C"
              label={WAVE_TYPE_LABEL[waveType] ?? waveType}
            />
          </View>
        </Card>
      )}
      {developmentLevel && (
        <Card color="secondary">
          <View style={styles.cardRow}>
            <View style={styles.label}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name="business-outline"
                size={12}
              />
              <Text color="muted" variant="bodySmall">
                Desarrollo
              </Text>
            </View>
            <Badge
              color="#6B4FA0"
              label={
                DEVELOPMENT_LEVEL_LABEL[developmentLevel] ?? developmentLevel
              }
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
