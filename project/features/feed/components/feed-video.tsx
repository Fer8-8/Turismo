import { Image } from "expo-image";
import { type VideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { useVideoControls } from "../hooks/use-video-controls";
import { FeedVideoInfo } from "./feed-video-info";
import { VideoPlayPauseIcon } from "./video-play-pause-icon";
import { VideoSeekOverlay } from "./video-seek-overlay";

type FeedVideoProps = {
  isActive: boolean;
  player: VideoPlayer;
  placeId?: string;
  thumbnailUrl?: string;
  video: {
    title: string;
    description: string;
  };
};

export function FeedVideo({
  isActive,
  player,
  placeId,
  thumbnailUrl,
  video,
}: FeedVideoProps) {
  const {
    toggleVideo,
    isPlaying,
    seekVideoGesture,
    isScrubbing,
    previewTime,
    duration,
  } = useVideoControls(player);

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!isActive) {
      opacity.value = 0;
    }
  }, [isActive, opacity]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  function onVideoPress() {
    toggleVideo();

    opacity.value = withTiming(1, { duration: 200 }, () => {
      opacity.value = withDelay(1000, withTiming(0, { duration: 500 }));
    });
  }

  return (
    <View style={styles.videoContainer}>
      <Pressable onPress={onVideoPress} style={styles.pressableContainer}>
        {thumbnailUrl ? (
          <Image
            contentFit="cover"
            source={{ uri: thumbnailUrl }}
            style={styles.video}
          />
        ) : (
          <View style={styles.video} />
        )}
        {isActive ? (
          <VideoView
            allowsPictureInPicture={false}
            contentFit="cover"
            fullscreenOptions={{ enable: false }}
            nativeControls={false}
            player={player}
            style={styles.videoOverlay}
          />
        ) : null}

        <VideoPlayPauseIcon isPlaying={isPlaying} style={animatedButtonStyle} />
      </Pressable>

      <VideoSeekOverlay
        duration={duration}
        isScrubbing={isScrubbing}
        previewTime={previewTime}
      />

      <GestureDetector gesture={seekVideoGesture}>
        <Animated.View style={styles.videoInfo}>
          {placeId ? (
            <FeedVideoInfo
              placeId={placeId}
              videoDescription={video.description}
              videoTitle={video.title}
            />
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  pressableContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
    backgroundColor: "#141414",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoInfo: {
    position: "absolute",
    bottom: NAVIGATION_HEIGTH + SPACING.sm,
    paddingHorizontal: SPACING.md,
    width: "100%",
    minHeight: 60,
  },
});
