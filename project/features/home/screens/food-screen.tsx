import { StyleSheet, View } from "react-native";
import { ExploreFoodPlacesList } from "@/features/places/components/food/explore-food-places-list";
import { NearFoodPlacesList } from "@/features/places/components/food/near-food-places-list";
import { PopularFoodPlacesList } from "@/features/places/components/food/popular-food-places-list";
import { useUserLocation } from "@/hooks/use-user-location";
import { SPACING } from "@/lib/theme";

export function FoodScreen() {
  const { latitude, longitude } = useUserLocation();

  return (
    <View style={styles.content}>
      <PopularFoodPlacesList />
      {latitude && longitude ? (
        <NearFoodPlacesList userLocation={{ latitude, longitude }} />
      ) : null}
      <ExploreFoodPlacesList />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING["4xl"],
  },
});
