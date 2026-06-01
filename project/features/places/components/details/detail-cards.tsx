import { Ionicons, Octicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";
import {
  CROWD_LEVEL_COLOR,
  CROWD_LEVEL_LABEL,
  MONTH_LABEL,
  PRICE_LEVEL_COLOR,
  PRICE_LEVEL_LABEL,
  SEASON_LABEL,
} from "./detail-utils";

export type AmenityItem = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
};

function formatCostRange(min?: number | null, max?: number | null): string {
  if (min != null && max != null) {
    return `$${min} - $${max} MXN`;
  }
  if (min != null) {
    return `desde $${min} MXN`;
  }
  return `hasta $${max} MXN`;
}

export function VisitAverageCard({
  typicalVisitHours,
  recommendedDays,
}: {
  typicalVisitHours?: number | null;
  recommendedDays?: number | null;
}) {
  if (typicalVisitHours == null && recommendedDays == null) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Octicons color={THEME["foreground-muted"]} name="clock" size={12} />
          <Text color="muted" variant="bodySmall">
            Visita promedio
          </Text>
        </View>
        <View style={styles.right}>
          {typicalVisitHours != null && (
            <Text color="title" variant="bodySmall">
              {typicalVisitHours}h
            </Text>
          )}
          {typicalVisitHours != null && recommendedDays != null && (
            <Text color="muted" variant="bodySmall">
              ·
            </Text>
          )}
          {recommendedDays != null && (
            <Text color="title" variant="bodySmall">
              {recommendedDays} {recommendedDays === 1 ? "día" : "días"}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

export function CrowdLevelCard({ crowdLevel }: { crowdLevel?: string | null }) {
  if (!crowdLevel) {
    return null;
  }

  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Octicons color={THEME["foreground-muted"]} name="person" size={12} />
          <Text color="muted" variant="bodySmall">
            Afluencia
          </Text>
        </View>
        <Badge
          color={CROWD_LEVEL_COLOR[crowdLevel] ?? "#555"}
          label={CROWD_LEVEL_LABEL[crowdLevel] ?? crowdLevel}
        />
      </View>
    </Card>
  );
}

export function PriceLevelCard({ priceLevel }: { priceLevel?: string | null }) {
  if (!priceLevel) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Octicons color={THEME["foreground-muted"]} name="tag" size={12} />
          <Text color="muted" variant="bodySmall">
            Precio
          </Text>
        </View>
        <Badge
          color={PRICE_LEVEL_COLOR[priceLevel] ?? "#555"}
          label={PRICE_LEVEL_LABEL[priceLevel] ?? priceLevel}
        />
      </View>
    </Card>
  );
}

export function AmenitiesCard({ items }: { items: AmenityItem[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Octicons
            color={THEME["foreground-muted"]}
            name="check-circle"
            size={12}
          />
          <Text color="muted" variant="bodySmall">
            Servicios
          </Text>
        </View>
        <View style={styles.badgeCloud}>
          {items.map((item) => (
            <View key={item.label} style={styles.amenityItem}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name={item.icon}
                size={13}
              />
              <Text variant="caption">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

export function RequirementsCard({ items }: { items: AmenityItem[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Octicons color={THEME["foreground-muted"]} name="info" size={12} />
          <Text color="muted" variant="bodySmall">
            Requisitos
          </Text>
        </View>
        <View style={styles.badgeCloud}>
          {items.map((item) => (
            <View key={item.label} style={styles.amenityItem}>
              <Ionicons
                color={THEME["foreground-muted"]}
                name={item.icon}
                size={13}
              />
              <Text variant="caption">{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

export function BestSeasonsCard({
  bestSeasons,
}: {
  bestSeasons?: string[] | null;
}) {
  if (!bestSeasons || bestSeasons.length === 0) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Ionicons
            color={THEME["foreground-muted"]}
            name="sunny-outline"
            size={12}
          />
          <Text color="muted" variant="bodySmall">
            Mejor época
          </Text>
        </View>
        <View style={styles.badgeCloud}>
          {bestSeasons.map((s) => (
            <Badge color="#2D7D46" key={s} label={SEASON_LABEL[s] ?? s} />
          ))}
        </View>
      </View>
    </Card>
  );
}

export function AvoidSeasonsCard({
  avoidSeasons,
}: {
  avoidSeasons?: string[] | null;
}) {
  if (!avoidSeasons || avoidSeasons.length === 0) {
    return null;
  }

  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Ionicons
            color={THEME["foreground-muted"]}
            name="warning-outline"
            size={12}
          />
          <Text color="muted" variant="bodySmall">
            Evitar en
          </Text>
        </View>
        <View style={styles.badgeCloud}>
          {avoidSeasons.map((s) => (
            <Badge color="#C0392B" key={s} label={SEASON_LABEL[s] ?? s} />
          ))}
        </View>
      </View>
    </Card>
  );
}

export function IdealMonthsCard({
  idealMonths,
}: {
  idealMonths?: string[] | null;
}) {
  if (!idealMonths || idealMonths.length === 0 || idealMonths.length >= 12) {
    return null;
  }

  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Octicons
            color={THEME["foreground-muted"]}
            name="calendar"
            size={12}
          />
          <Text color="muted" variant="bodySmall">
            Meses ideales
          </Text>
        </View>
        <View style={styles.badgeCloud}>
          {idealMonths.map((m) => (
            <Badge color="#6B4FA0" key={m} label={MONTH_LABEL[m] ?? m} />
          ))}
        </View>
      </View>
    </Card>
  );
}

export function TemperatureCard({
  avgTempWinterCelsius,
  avgTempSummerCelsius,
}: {
  avgTempWinterCelsius?: number | null;
  avgTempSummerCelsius?: number | null;
}) {
  if (avgTempWinterCelsius == null && avgTempSummerCelsius == null) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Ionicons
            color={THEME["foreground-muted"]}
            name="thermometer-outline"
            size={12}
          />
          <Text color="muted" variant="bodySmall">
            Temperatura
          </Text>
        </View>
        <View style={styles.right}>
          {avgTempWinterCelsius != null && (
            <Text variant="bodySmall">{avgTempWinterCelsius}°C invierno</Text>
          )}
          {avgTempWinterCelsius != null && avgTempSummerCelsius != null && (
            <Text color="muted" variant="bodySmall">
              ·
            </Text>
          )}
          {avgTempSummerCelsius != null && (
            <Text variant="bodySmall">{avgTempSummerCelsius}°C verano</Text>
          )}
        </View>
      </View>
    </Card>
  );
}

export function DailyCostCard({
  estimatedDailyCostMin,
  estimatedDailyCostMax,
}: {
  estimatedDailyCostMin?: number | null;
  estimatedDailyCostMax?: number | null;
}) {
  if (estimatedDailyCostMin == null && estimatedDailyCostMax == null) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Octicons
            color={THEME["foreground-muted"]}
            name="credit-card"
            size={12}
          />
          <Text color="muted" variant="bodySmall">
            Costo diario est.
          </Text>
        </View>
        <Text color="title" variant="bodySmall">
          {formatCostRange(estimatedDailyCostMin, estimatedDailyCostMax)}
        </Text>
      </View>
    </Card>
  );
}

export function AccommodationCostCard({
  accommodationAvgCost,
}: {
  accommodationAvgCost?: number | null;
}) {
  if (accommodationAvgCost == null) {
    return null;
  }
  return (
    <Card color="secondary">
      <View style={styles.cardRow}>
        <View style={styles.label}>
          <Ionicons
            color={THEME["foreground-muted"]}
            name="bed-outline"
            size={12}
          />
          <Text color="muted" variant="bodySmall">
            Hospedaje promedio
          </Text>
        </View>
        <Text color="title" variant="bodySmall">
          ${accommodationAvgCost} MXN / noche
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  badgeCloud: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: SPACING.xs,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
