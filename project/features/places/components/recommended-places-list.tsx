import { useRouter } from "expo-router";
import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SectionHeader } from "../../home/components/section-header";
import { useGetTopPlaces } from "../api/get-top-places";
import { RecommendedPlaceItem } from "./recommended-place-item";

export function RecommendedPlacesList() {
  const { data, isLoading } = useGetTopPlaces();
  const router = useRouter();

  function navigateTopPlace(placeId: string) {
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
      <View>
        <SectionHeader title="Recomendados para mí" />
        <HorizontalScroll>
          <Skeleton style={{ width: 150, height: 200 }} />
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
      <SectionHeader
        onPressRightText={handleSeeAll}
        rightText="ver más"
        title="Recomendados para mí"
      />
      <HorizontalScroll>
        {data?.map((item) => (
          <RecommendedPlaceItem
            imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            key={item.id}
            onPress={() => navigateTopPlace(item.id)}
            subtitle={item.state?.name ?? "Sin estado"}
            title={item.name}
          />
        ))}
      </HorizontalScroll>
    </View>
  );
}
