import { StyleSheet, View } from "react-native";
import { LiveEventBanner } from "@/features/activities/components/live-event-banner";
import { ExploreByInterests } from "@/features/home/components/explore-by-interests";
import { NearMePlacesList } from "@/features/places/components/near-me-places-list";
import { PopularPlacesGrid } from "@/features/places/components/popular-places-grid";
import { RecommendedPlacesList } from "@/features/places/components/recommended-places-list";
import { TopTenPlacesList } from "@/features/places/components/top-ten-places-list";
import { TravelGuidesList } from "@/features/places/components/travel-guides-list";
import { useUserLocation } from "@/hooks/use-user-location";
import { SPACING } from "@/lib/theme";

export function HomeFeedScreen() {
  const { latitude, longitude } = useUserLocation();
  return (
    <View style={styles.content}>
      <TopTenPlacesList />
      <LiveEventBanner />
      {latitude && longitude ? (
        <NearMePlacesList userLocation={{ latitude, longitude }} />
      ) : null}
      <RecommendedPlacesList />
      <TravelGuidesList />
      <ExploreByInterests />
      <PopularPlacesGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING["4xl"],
  },
});
