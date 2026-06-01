import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { getDistance } from "@/lib/geodistance";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { useGetAllNearbyPlaces } from "../../api/get-all-near-places";
import { PlaceListItem } from "./place-list-item";

type PlacesListByDistanceProps = {
  navigateToPlace: (placeId: string) => void;
  userLatitude: number;
  userLongitude: number;
};

export function PlacesListByDistance({
  navigateToPlace,
  userLatitude,
  userLongitude,
}: PlacesListByDistanceProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllNearbyPlaces(userLatitude, userLongitude);

  function handleEndReached() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <FixedHeaderLayout>
          <ScreenHeader titleKey="home.results.byDistance" />
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

  if (userLatitude === 0 && userLongitude === 0) {
    return (
      <View style={{ flex: 1 }}>
        <FixedHeaderLayout>
          <ScreenHeader titleKey="home.results.byDistance" />
        </FixedHeaderLayout>
        <View style={{ gap: SPACING.sm, paddingHorizontal: SPACING.lg }}>
          <Text align="center">Ubicación no disponible</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FixedHeaderLayout>
        <ScreenHeader titleKey="home.results.byDistance" />
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
        renderItem={({ item }) => {
          if (!(item.latitude && item.longitude)) {
            return null;
          }

          const distance = getDistance(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: item.latitude, longitude: item.longitude }
          );

          return (
            <PlaceListItem
              badges={[item?.category?.category ?? "", item?.state?.name ?? ""]}
              imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
              key={item.id}
              onPress={() => navigateToPlace(item.id)}
              subtitle={`${distance.toFixed(0)} km`}
              title={item.name}
            />
          );
        }}
      />
    </View>
  );
}
