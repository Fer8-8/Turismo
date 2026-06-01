import { FlashList, type ViewToken } from "@shopify/flash-list";
import { useVideoPlayer } from "expo-video";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SCREEN_HEIGHT } from "@/lib/constants";
import { LAYOUT } from "@/lib/theme";
import { useGetPlaceVideos } from "../../api/get-place-videos";
import { PlaceDetailsVideo } from "./place-details-video";

export function PlaceDetailsVideoPlayer() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPlaceVideos("1660776c-7353-588c-993d-bc6b50d9b218");

  const videos = useMemo(() => data?.media ?? [], [data?.media]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [readyItemId, setReadyItemId] = useState<string | null>(null);

  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    const active = videos.find((v) => v.id === activeItemId);
    if (!active) {
      return;
    }

    setReadyItemId(null);
    player.replaceAsync(active.stream_url ?? active.url).then(() => {
      setReadyItemId(active.id);
      player.play();
    });
  }, [activeItemId, player, videos]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<{ id: string }>[] }) => {
      if (viewableItems.length > 0) {
        setActiveItemId(viewableItems[0].item.id);
      }
    }
  ).current;

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={styles.content}>
      <FlashList
        data={videos}
        decelerationRate="fast"
        disableIntervalMomentum
        keyExtractor={(item) => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled={true}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <PlaceDetailsVideo
              isActive={readyItemId === item.id}
              player={player}
              thumbnailUrl={item.miniature_url ?? undefined}
              videoContainerStyle={LAYOUT.flex1}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    height: SCREEN_HEIGHT - SCREEN_HEIGHT * 0.22,
  },
  item: {
    height: SCREEN_HEIGHT - SCREEN_HEIGHT * 0.22,
  },
});
