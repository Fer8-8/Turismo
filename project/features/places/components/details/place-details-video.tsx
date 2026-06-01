import { Image } from "expo-image";
import { type VideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { VideoPlayPauseIcon } from "@/features/feed/components/video-play-pause-icon";
import { VideoSeekOverlay } from "@/features/feed/components/video-seek-overlay";
import { useVideoControls } from "@/features/feed/hooks/use-video-controls";

type PlaceDetailsVideoProps = {
  isActive: boolean;
  player: VideoPlayer;
  thumbnailUrl?: string;
  videoContainerStyle?: StyleProp<ViewStyle>;
};

export function PlaceDetailsVideo({
  isActive,
  player,
  thumbnailUrl,
  videoContainerStyle,
}: PlaceDetailsVideoProps) {
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
    <View style={[styles.videoContainer, videoContainerStyle]}>
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

        <VideoSeekOverlay
          duration={duration}
          isScrubbing={isScrubbing}
          previewTime={previewTime}
        />

        <GestureDetector gesture={seekVideoGesture}>
          <View style={styles.gestureArea} />
        </GestureDetector>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
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
  gestureArea: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    height: 60,
  },
});
