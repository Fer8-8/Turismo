import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAllEventsByPlacesQuery } from "@/features/places/api/get-all-events-by-places";
import type { GetAllEventsByPlacesQuery } from "@/gql/graphql";
import { SPACING, THEME } from "@/lib/theme";
import { EventDay } from "./event-day";
import { LiveEventBannerPattern } from "./live-event-banner-pattern";

type Event = NonNullable<GetAllEventsByPlacesQuery["events"]["events"]>[number];

export function LiveEventBanner() {
  const now = new Date();

  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );

  const { data: events, isLoading } = useAllEventsByPlacesQuery(
    startOfDay.toISOString()
  );

  const event = events?.find((e: Event) => {
    const start = new Date(e.start_date);
    const end = new Date(e.end_date);
    const isActive = now >= start && now <= end;
    const isNotWorldCup = e.category?.category !== "Mundial 2026";
    return isActive && isNotWorldCup;
  });

  if (isLoading) {
    return null;
  }

  if (!event) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <View style={styles.dayContainer}>
        <EventDay date={event.start_date} />
      </View>
      <View style={styles.eventInfo}>
        <Text color="muted" variant="caption">
          En este Momento
        </Text>
        <View>
          <Text color="title" variant="subtitle">
            {event.name}
          </Text>
          <Text variant="caption">
            {event.state?.name ?? "Ubicación desconocida"}
          </Text>
        </View>
        <Button style={styles.action}>
          <Text color="inverse">Explorar</Text>
        </Button>
      </View>
      <LiveEventBannerPattern />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    padding: 0,
    flexDirection: "row",
    overflow: "hidden",
    flex: 1,
  },
  dayContainer: {
    paddingHorizontal: SPACING.xl,
    borderRightWidth: 2,
    borderColor: THEME.surface,
    alignSelf: "flex-start",
    height: "100%",
    justifyContent: "center",
  },
  eventInfo: {
    flex: 1,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  action: {
    height: 36,
    backgroundColor: "#F54900",
    alignSelf: "flex-start",
  },
});
