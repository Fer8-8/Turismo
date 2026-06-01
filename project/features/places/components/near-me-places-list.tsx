import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { getDistance } from "@/lib/geodistance";
import { SPACING } from "@/lib/theme";
import { SectionHeader } from "../../home/components/section-header";
import { useGetAllNearbyPlaces } from "../api/get-all-near-places";
import { NearMePlaceItem } from "./near-me-place-item";

type NearMePlaceListProps = {
  userLocation: { latitude: number; longitude: number };
};

export function NearMePlacesList({ userLocation }: NearMePlaceListProps) {
  const router = useRouter();
  const { latitude, longitude } = userLocation;
  const { data } = useGetAllNearbyPlaces(latitude, longitude);
  const places = data?.places?.slice(0, 4) ?? [];

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  function handleSeeAll() {
    router.push({
      pathname: "/home/results",
      params: { byDistance: "true" },
    });
  }

  return (
    <View>
      <SectionHeader
        onPressRightText={handleSeeAll}
        rightText="ver más"
        title="Cerca de mí"
      />

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
                badges={[
                  `${distance.toFixed(0)} km`,
                  p?.category?.category ?? "",
                ]}
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
