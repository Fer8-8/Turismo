import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { getDistance } from "@/lib/geodistance";
import { SPACING } from "@/lib/theme";
import { SectionHeader } from "../../../home/components/section-header";
import { useGetAllNearbyMagicalTowns } from "../../api/get-all-near-magical-towns";
import { NearMagicalTownListItem } from "../near-magical-town-list-item";

type NearMagicalTownListProps = {
  userLocation: { latitude: number; longitude: number };
};

export function NearMagicalTownList({
  userLocation,
}: NearMagicalTownListProps) {
  const { data } = useGetAllNearbyMagicalTowns(
    userLocation.latitude,
    userLocation.longitude
  );
  const places = data?.places.slice(0, 4) ?? [];

  const router = useRouter();
  const { latitude, longitude } = userLocation;

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  return (
    <View>
      <SectionHeader title="Cerca de mí" />
      <View style={styles.content}>
        {places?.map((p) => {
          if (!(p.latitude && p.longitude)) {
            return null;
          }
          const distance = getDistance(
            { latitude, longitude },
            { latitude: p.latitude, longitude: p.longitude }
          );

          return (
            <Pressable key={p.id} onPress={() => navigateToPlace(p.id)}>
              <NearMagicalTownListItem
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
  content: {
    gap: SPACING.sm,
    flex: 1,
    marginHorizontal: SPACING.lg,
  },
  new: {
    flex: 1,
  },
  title: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
  },
});
