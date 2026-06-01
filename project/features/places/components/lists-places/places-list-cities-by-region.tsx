import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { ValidRegions } from "@/gql/graphql";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { useGetAllCities } from "../../api/get-all-cities";
import { PlaceListItem } from "./place-list-item";

type PlacesListCitiesByRegionProps = {
  regions: ValidRegions[];
  navigateToPlace: (placeId: string) => void;
};

export function PlacesListCitiesByRegion({
  regions,
  navigateToPlace,
}: PlacesListCitiesByRegionProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllCities(regions);

  function handleEndReached() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <FixedHeaderLayout>
          <ScreenHeader titleKey="home.results.cities" />
        </FixedHeaderLayout>
        <View style={{ gap: SPACING.sm, paddingHorizontal: SPACING.lg }}>
          <Skeleton style={{ height: 100 }} />
          <Skeleton style={{ height: 100 }} />
          <Skeleton style={{ height: 100 }} />
          <Skeleton style={{ height: 100 }} />
          <Skeleton style={{ height: 100 }} />
          <Skeleton style={{ height: 100 }} />
          <Skeleton style={{ height: 100 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FixedHeaderLayout>
        <ScreenHeader titleKey="home.results.cities" />
      </FixedHeaderLayout>
      <FlashList
        contentContainerStyle={{
          paddingBottom: NAVIGATION_HEIGTH + SPACING.xl,
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.xl,
        }}
        data={data?.places ?? []}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: SPACING.xs }} />
        )}
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.7}
        renderItem={({ item }) => (
          <PlaceListItem
            badges={[]}
            imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            onPress={() => navigateToPlace(item.id)}
            subtitle={item?.state?.name ?? ""}
            title={item.name}
          />
        )}
      />
    </View>
  );
}
