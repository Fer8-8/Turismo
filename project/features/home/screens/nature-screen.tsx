import { StyleSheet, View } from "react-native";
import { ExploreNaturePlacesList } from "@/features/places/components/nature/explore-nature-places-list";
import { NearNaturePlacesList } from "@/features/places/components/nature/near-nature-places-list";
import { PopularNaturePlacesList } from "@/features/places/components/nature/popular-nature-places-list";
import { useUserLocation } from "@/hooks/use-user-location";
import { SPACING } from "@/lib/theme";

export function NatureScreen() {
  const { latitude, longitude } = useUserLocation();

  return (
    <View style={styles.content}>
      <PopularNaturePlacesList />
      {latitude && longitude ? (
        <NearNaturePlacesList userLocation={{ latitude, longitude }} />
      ) : null}
      <ExploreNaturePlacesList />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING["4xl"],
  },
});
