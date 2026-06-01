import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { useGetAllPlaces } from "../../api/get-all-places";
import { PlaceListItem } from "./place-list-item";

type PlacesListProps = {
  navigateToPlace: (placeId: string) => void;
};

export function PlacesList({ navigateToPlace }: PlacesListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllPlaces();

  function handleEndReached() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <FixedHeaderLayout>
          <ScreenHeader titleKey="home.results.allPlaces" />
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
        <ScreenHeader titleKey="home.results.allPlaces" />
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
            subtitle={item.state?.name ?? "Sin estado"}
            title={item.name}
          />
        )}
      />
    </View>
  );
}
