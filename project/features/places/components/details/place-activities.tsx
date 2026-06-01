import { Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { RADIUS, SPACING, THEME } from "@/lib/theme";
import { useGetPlaceActivities } from "../../api/get-place-activities";
import {
  DIFFICULTY_LEVEL_COLOR,
  DIFFICULTY_LEVEL_LABEL,
  MONTH_LABEL,
} from "./detail-utils";

type PlaceActivitiesProps = {
  placeId: string;
};

export function PlaceActivities({ placeId }: PlaceActivitiesProps) {
  const { data: activities, isLoading } = useGetPlaceActivities(placeId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle} variant="body">
          Actividades
        </Text>
        <HorizontalScroll contentContainerStyle={{ paddingHorizontal: 0 }}>
          <Skeleton style={styles.skeletonCard} />
          <Skeleton style={styles.skeletonCard} />
          <Skeleton style={styles.skeletonCard} />
        </HorizontalScroll>
      </View>
    );
  }

  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle} variant="body">
        Actividades
      </Text>
      <HorizontalScroll contentContainerStyle={{ paddingHorizontal: 0 }}>
        {activities.map((activity) => {
          const difficultyColor =
            DIFFICULTY_LEVEL_COLOR[activity.difficulty_level ?? ""] ?? "#555";
          const difficultyLabel =
            DIFFICULTY_LEVEL_LABEL[activity.difficulty_level ?? ""] ??
            activity.difficulty_level;

          const availableMonths = (activity.available_months ?? [])
            .map((m: string) => MONTH_LABEL[m] ?? m)
            .join(", ");

          return (
            <Card color="secondary" key={activity.id} style={styles.card}>
              <Image
                contentFit="cover"
                source={{ uri: activity.media?.[0]?.url ?? IMAGE_PLACEHOLDER }}
                style={styles.image}
              />

              <View style={styles.cardContent}>
                <Text
                  numberOfLines={2}
                  style={styles.activityName}
                  variant="body"
                >
                  {activity.activity_name}
                </Text>

                {difficultyLabel && (
                  <Badge color={difficultyColor} label={difficultyLabel} />
                )}

                <View style={styles.metaRow}>
                  {activity.min_age != null && (
                    <View style={styles.metaItem}>
                      <Octicons
                        color={THEME["foreground-muted"]}
                        name="person"
                        size={11}
                      />
                      <Text color="muted" variant="caption">
                        +{activity.min_age} años
                      </Text>
                    </View>
                  )}
                  {activity.additional_cost && (
                    <View style={styles.metaItem}>
                      <Octicons
                        color={THEME["foreground-muted"]}
                        name="tag"
                        size={11}
                      />
                      <Text color="muted" variant="caption">
                        Costo extra
                      </Text>
                    </View>
                  )}
                  {activity.requires_equipment && (
                    <View style={styles.metaItem}>
                      <Octicons
                        color={THEME["foreground-muted"]}
                        name="tools"
                        size={11}
                      />
                      <Text color="muted" variant="caption">
                        Equipo
                      </Text>
                    </View>
                  )}
                </View>

                {availableMonths.length > 0 && (
                  <View style={styles.metaItem}>
                    <Octicons
                      color={THEME["foreground-muted"]}
                      name="calendar"
                      size={11}
                    />
                    <Text color="muted" numberOfLines={2} variant="caption">
                      {availableMonths}
                    </Text>
                  </View>
                )}
              </View>
            </Card>
          );
        })}
      </HorizontalScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  skeletonCard: {
    width: 180,
    height: 240,
    borderRadius: RADIUS.xl,
  },
  card: {
    width: 180,
    padding: 0,
    overflow: "hidden",
    gap: 0,
  },
  image: {
    width: "100%",
    height: 110,
  },
  cardContent: {
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  activityName: {
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
