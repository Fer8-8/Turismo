import { StyleSheet, View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SPACING } from "@/lib/theme";
import { useGetNextCulturalEvents } from "../api/get-next-cultural-events";
import { NextCulturalEventItem } from "./next-cultural-event-item";

const EVENTS_LIMIT = 5;

export function NextCulturalEventsList() {
  const { data } = useGetNextCulturalEvents(EVENTS_LIMIT);

  if (!data?.events?.length) {
    return null;
  }

  return (
    <View>
      <SectionHeader title="Próximos eventos" />
      <View style={styles.container}>
        {data?.events?.map((e) => (
          <NextCulturalEventItem
            eventEndDate={e.end_date}
            eventImageUrl={e.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            eventName={e.name}
            eventStartDate={e.start_date}
            eventState={e.state?.name ?? ""}
            key={e.id}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "column",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});
