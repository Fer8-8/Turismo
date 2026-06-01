import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useGetCategories } from "@/features/home/api/get-categories";
import { SectionHeader } from "@/features/home/components/section-header";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SPACING } from "@/lib/theme";
import { useGetAllPlacesByCategory } from "../../api/get-all-places-by-category";
import TopCulturalPlacesitem from "../culture/top-cultural-places-item";

const PLACES_LIMIT = 10;

export function ExploreFoodPlacesList() {
  const { data: categories } = useGetCategories();
  const foodCategory = categories?.find(
    (cat) => cat.category === "Gastronomia"
  );

  const { data } = useGetAllPlacesByCategory(
    foodCategory?.id_category,
    PLACES_LIMIT
  );

  const router = useRouter();

  function handleSeeAll() {
    if (foodCategory) {
      router.push({
        pathname: "/home/results",
        params: { categoryId: foodCategory.id_category },
      });
    }
  }

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  return (
    <View>
      <SectionHeader
        onPressRightText={handleSeeAll}
        rightText="ver más"
        title="Explora la gastronomía"
      />
      <View style={styles.grid}>
        {data?.places?.map((place) => (
          <Pressable
            key={place.id}
            onPress={() => navigateToPlace(place.id)}
            style={styles.item}
          >
            <TopCulturalPlacesitem
              imageUrl={place.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
              subtitle={place.state?.name ?? ""}
              title={place.name}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  item: {
    width: "48%",
    marginBottom: SPACING.xl,
  },
});
