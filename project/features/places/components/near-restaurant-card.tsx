import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { getDistance } from "@/lib/geodistance";
import { SPACING } from "@/lib/theme";
import { SectionHeader } from "../../home/components/section-header";
import { useGetAllNearRestaurant } from "../api/get-all-near-restaurant";
import { NearMePlaceItem } from "./near-me-place-item";

type NearRestaurantListProps = {
  userLocation: { latitude: number; longitude: number };
};

export function NearRestaurantCard({ userLocation }: NearRestaurantListProps) {
  const router = useRouter();
  const { latitude, longitude } = userLocation;
  const { data } = useGetAllNearRestaurant(latitude, longitude);
  const places = data?.places.slice(0, 5) ?? [];

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
        {places.map((p) => {
          if (!(p.latitude && p.longitude)) {
            return null;
          }
          const distance = getDistance(
            { latitude, longitude },
            { latitude: p.latitude, longitude: p.longitude }
          );

          return (
            <Pressable key={p.id} onPress={() => navigateToPlace(p.id)}>
              <NearMePlaceItem
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
    gap: 8,
    paddingHorizontal: SPACING.lg,
  },
});
