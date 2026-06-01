import { useRouter } from "expo-router";
import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { SectionHeader } from "../../../home/components/section-header";
import { useGetMostPopularMagicalTown } from "../../api/get-most-popular-magical-town";
import { MostPopularMagicalTownItem } from "../most-popular-magical-town-item";

export function MostPopularMagicalTownList() {
  const { data, isLoading } = useGetMostPopularMagicalTown();
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
          <Skeleton style={{ width: 150, height: 200 }} />
        </HorizontalScroll>
      </View>
    );
  }

  return (
    <View>
      <SectionHeader title="Lo más popular" />
      <HorizontalScroll>
        {data?.map((item) => (
          <MostPopularMagicalTownItem
            imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            key={item.id}
            onPress={() => navigateToPlace(item.id)}
            subtitle={item.state?.name ?? ""}
            title={item.name}
          />
        ))}
      </HorizontalScroll>
    </View>
  );
}
