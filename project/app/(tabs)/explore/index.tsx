import { useIsFocused } from "@react-navigation/native";
import { FlashList, type ViewToken } from "@shopify/flash-list";
import { useVideoPlayer } from "expo-video";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useGetFeedVideos } from "@/features/feed/api/get-feed-videos";
import { FeedVideo } from "@/features/feed/components/feed-video";
import { SCREEN_HEIGHT } from "@/lib/constants";

export default function ExploreFeedScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetFeedVideos();

  const isFocused = useIsFocused();

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

    if (!isFocused) {
      player.pause();
      return;
    }

    setReadyItemId(null);
    player.replaceAsync(active.stream_url ?? active.url).then(() => {
      setReadyItemId(active.id);
      player.play();
    });
  }, [activeItemId, isFocused, player, videos]);

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
    <View style={{ flex: 1, backgroundColor: "#141414" }}>
      <FlashList
        data={videos}
        decelerationRate="fast"
        disableIntervalMomentum
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        pagingEnabled={true}
        renderItem={({ item }) => (
          <View style={{ height: SCREEN_HEIGHT }}>
            <FeedVideo
              isActive={readyItemId === item.id && isFocused}
              placeId={item.place?.id}
              player={player}
              thumbnailUrl={item.miniature_url ?? undefined}
              video={{
                title: item?.place?.name || "",
                description: item?.place?.description || "",
              }}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}
