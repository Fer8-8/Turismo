import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { useGetAllPlacesByState } from "../../api/get-all-places-by-state";
import { PlaceListItem } from "./place-list-item";

type PlacesListByStateProps = {
  stateId: string;
  navigateToPlace: (placeId: string) => void;
};

export function PlacesListByState({
  stateId,
  navigateToPlace,
}: PlacesListByStateProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllPlacesByState(stateId);

  function handleEndReached() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <FixedHeaderLayout>
          <ScreenHeader titleKey="home.results.byState" />
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
        <ScreenHeader titleKey="home.results.byState" />
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
            badges={item.category?.category ? [item.category.category] : []}
            imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
            onPress={() => navigateToPlace(item.id)}
            subtitle={""}
            title={item.name}
          />
        )}
      />
    </View>
  );
}
