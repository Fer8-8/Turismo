import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { getDistance } from "@/lib/geodistance";
import { SPACING } from "@/lib/theme";
import { useGetNearbyCulturalPlaces } from "../../api/get-nearby-cultural-places";
import { NearbyCulturalPlacesItem } from "./nearby-cultural-places-item";

const PLACES_LIMIT = 5;

type NearbyCulturalPlacesListProps = {
  userLocation: { latitude: number; longitude: number };
};

export function NearbyCulturalPlacesList({
  userLocation,
}: NearbyCulturalPlacesListProps) {
  const { latitude, longitude } = userLocation;
  const { data } = useGetNearbyCulturalPlaces(
    latitude,
    longitude,
    PLACES_LIMIT
  );

  const router = useRouter();

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  return (
    <View>
      <SectionHeader title="Cerca de mí" />
      <View style={styles.container}>
        {data?.places.map((p) => {
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
                subtitle={p?.state?.name ?? ""}
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
    justifyContent: "space-between",
    flexDirection: "column",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});
