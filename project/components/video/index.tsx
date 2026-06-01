import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import type { Video } from "@/features/feed/types/video";

type FeedVideoProps = {
  isActive: boolean;
  video: Video;
  videoContainerStyle?: StyleProp<ViewStyle>;
};

export function VideoItem({
  isActive,
  video,
  videoContainerStyle,
}: FeedVideoProps) {
  const opacity = useSharedValue(0);

  const player = useVideoPlayer(video.video, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      opacity.value = 0;
    }
  }, [isActive, opacity, player]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  function toggleVideo() {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }

    opacity.value = withTiming(1, { duration: 200 }, () => {
      opacity.value = withDelay(1000, withTiming(0, { duration: 500 }));
    });
  }

  return (
    <View style={[styles.videoContainer, videoContainerStyle]}>
      <Pressable onPress={toggleVideo} style={styles.pressableContainer}>
        <VideoView
          allowsPictureInPicture={false}
          contentFit="cover"
          fullscreenOptions={{
            enable: false,
          }}
          nativeControls={false}
          player={player}
          style={styles.video}
        />

        <Animated.View style={[styles.playButton, animatedButtonStyle]}>
          <Ionicons
            color="#ffffff"
            name={isPlaying ? "pause" : "play"}
            size={36}
          />
        </Animated.View>
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
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    backgroundColor: "#14141480",
    borderRadius: 50,
    padding: 12,
  },
});
