import { useRouter } from "expo-router";
import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SectionHeader } from "../../home/components/section-header";
import { useGetTopRestaurant } from "../api/get-all-most-restaurant";
import { TopTenPlaceItem } from "./top-ten-place-item";

export function TopRestaurantCard() {
  const router = useRouter();

  const GASTRONOMIA_ID = "81903300-e893-5767-99c6-df44c8f9d1c6";

  const { data, isLoading } = useGetTopRestaurant(GASTRONOMIA_ID);

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  if (isLoading) {
    return (
      <View>
        <SectionHeader title="Top 10 restaurantes" />
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
        onPressRightText={() =>
          router.push({
            pathname: "/home/results",
            params: { categoryId: GASTRONOMIA_ID },
          })
        }
        rightText="ver más"
        title="Los mejores restaurantes"
      />

      <HorizontalScroll>
        {data?.slice(0, 10).map((item) => (
          <TopTenPlaceItem
            imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            key={item.id}
            onPress={() => navigateToPlace(item.id)}
            subtitle={item.state?.name ?? "sin estado"}
            title={item.name}
          />
        ))}
      </HorizontalScroll>
    </View>
  );
}
