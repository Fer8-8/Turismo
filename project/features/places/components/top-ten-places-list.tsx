import { useRouter } from "expo-router";
import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SectionHeader } from "../../home/components/section-header";
import { useGetTopPlaces } from "../api/get-top-places";
import { TopTenPlaceItem } from "./top-ten-place-item";

export function TopTenPlacesList() {
  const { data, isLoading } = useGetTopPlaces();
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
        <SectionHeader title="Top 10 destinos" />
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
      <SectionHeader title="Top 10 destinos" />
      <HorizontalScroll>
        {data?.map((item, idx) => (
          <TopTenPlaceItem
            imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            key={item.id}
            onPress={() => navigateToPlace(item.id)}
            position={idx + 1}
            subtitle={item.state?.name ?? "sin estado"}
            title={item.name}
          />
        ))}
      </HorizontalScroll>
    </View>
  );
}
