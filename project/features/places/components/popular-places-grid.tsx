import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SPACING } from "@/lib/theme";
import { SectionHeader } from "../../home/components/section-header";
import { useGetMostPopularPlaces } from "../api/get-most-popular-places";
import PopularPlaceGridItem from "./popular-place-grid-item";

export function PopularPlacesGrid() {
  const { data: places, isLoading } = useGetMostPopularPlaces();
  const router = useRouter();

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  function handleSeeAll() {
    router.push({
      pathname: "/home/results",
    });
  }

  if (isLoading) {
    return (
      <View style={styles.content}>
        {Array.from({ length: 8 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: just stable skeleton
          <Skeleton key={index} style={styles.skeleton} />
        ))}
      </View>
    );
  }

  return (
    <View>
      <SectionHeader
        onPressRightText={handleSeeAll}
        rightText="ver más"
        title="Lo más popular"
      />
      <View style={styles.content}>
        {places?.map((place) => (
          <Pressable
            key={place.id}
            onPress={() => navigateToPlace(place.id)}
            style={styles.item}
          >
            <PopularPlaceGridItem
              imageUrl={place?.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
              subtitle={place.state?.name ?? "Sin estado"}
              title={place.name}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  item: {
    width: "48%",
    marginBottom: SPACING.xl,
  },
  skeleton: {
    width: "100%",
    height: 150,
  },
});
