import { StyleSheet, View } from "react-native";
import { NearbyCulturalPlacesList } from "@/features/places/components/culture/nearby-cultural-places-list";
import { TopCulturalPlacesList } from "@/features/places/components/culture/top-cultural-places-list";
import { useUserLocation } from "@/hooks/use-user-location";
import { SPACING } from "@/lib/theme";
import { EventStoriesList } from "../components/event-stories-list";
import { NextCulturalEventsList } from "../components/next-cultural-events-list";

export function CultureEventsScreen() {
  const { latitude, longitude } = useUserLocation();
  return (
    <View style={styles.content}>
      <EventStoriesList />
      <NextCulturalEventsList />
      {latitude && longitude ? (
        <NearbyCulturalPlacesList userLocation={{ latitude, longitude }} />
      ) : null}
      <TopCulturalPlacesList />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING["4xl"],
  },
});
