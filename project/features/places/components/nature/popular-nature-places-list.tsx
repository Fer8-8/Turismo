import { useRouter } from "expo-router";
import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/features/home/api/get-categories";
import { SectionHeader } from "@/features/home/components/section-header";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { useGetAllPlacesByCategory } from "../../api/get-all-places-by-category";
import { MostPopularMagicalTownItem } from "../most-popular-magical-town-item";

const PLACES_LIMIT = 10;

export function PopularNaturePlacesList() {
  const { data: categories } = useGetCategories();
  const natureCategory = categories?.find(
    (cat) => cat.category === "Naturaleza"
  );

  const { data, isLoading } = useGetAllPlacesByCategory(
    natureCategory?.id_category,
    PLACES_LIMIT
  );

  const router = useRouter();

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  if (isLoading) {
    return (
      <View>
        <SectionHeader title="Lo más popular" />
        <HorizontalScroll>
          <Skeleton style={{ width: 150, height: 200 }} />
          <Skeleton style={{ width: 150, height: 200 }} />
          <Skeleton style={{ width: 150, height: 200 }} />
          <Skeleton style={{ width: 150, height: 200 }} />
        </HorizontalScroll>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title="Lo más popular" />
      <HorizontalScroll>
        {data?.places?.map((place) => (
          <MostPopularMagicalTownItem
            imageUrl={place.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            key={place.id}
            onPress={() => navigateToPlace(place.id)}
            subtitle={place.state?.name ?? ""}
            title={place.name}
          />
        ))}
      </HorizontalScroll>
    </View>
  );
}
