import { StyleSheet } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { SPACING } from "@/lib/theme";
import { EventStoriesItem } from "./event-stories-item";

export function EventStoriesList() {
  return (
    <HorizontalScroll contentContainerStyle={[styles.scrollContent]}>
      <EventStoriesItem ringColor="#FA1824" />
      <EventStoriesItem ringColor="#EC1F8D" />
      <EventStoriesItem ringColor="#FBA200" />
      <EventStoriesItem ringColor="#BD268F" />
      <EventStoriesItem ringColor="#7DC133" />
      <EventStoriesItem ringColor="#00AAC0" />
    </HorizontalScroll>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: SPACING.lg,
  },
});
