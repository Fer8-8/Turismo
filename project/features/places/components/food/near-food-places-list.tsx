import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { getDistance } from "@/lib/geodistance";
import { SPACING } from "@/lib/theme";
import { useGetNearbyFoodPlaces } from "../../api/get-nearby-food-places";
import { NearbyCulturalPlacesItem } from "../culture/nearby-cultural-places-item";

const PLACES_LIMIT = 5;

type NearFoodPlacesListProps = {
  userLocation: { latitude: number; longitude: number };
};

export function NearFoodPlacesList({ userLocation }: NearFoodPlacesListProps) {
  const { latitude, longitude } = userLocation;
  const { data } = useGetNearbyFoodPlaces(latitude, longitude, PLACES_LIMIT);

  const router = useRouter();

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  if (!data?.places.length) {
    return null;
  }

  return (
    <View>
      <SectionHeader title="Cerca de mí" />
      <View style={styles.container}>
        {data.places.map((p) => {
          if (!(p.latitude && p.longitude)) {
            return null;
          }

          const distance = getDistance(
            { latitude, longitude },
            { latitude: p.latitude, longitude: p.longitude }
          );

          return (
            <Pressable key={p.id} onPress={() => navigateToPlace(p.id)}>
              <NearbyCulturalPlacesItem
                badges={[`${distance.toFixed(0)} km`]}
                imageUrl={p.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
                subtitle={p.state?.name ?? ""}
                title={p.name}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});
