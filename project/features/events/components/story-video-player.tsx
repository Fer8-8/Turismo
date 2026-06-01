import { Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { VideoView } from "expo-video";
import { Modal, StyleSheet } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/lib/constants";
import { SPACING, THEME } from "@/lib/theme";
import { useStoryControls } from "../hooks/use-story-controls";
import type { Origin } from "../types";

type StoryVideoPlayerProps = {
  videoUrl: string;
  thumbnailUrl?: string;
  origin: Origin | null;
  onClose: () => void;
};

export function StoryVideoPlayer({
  videoUrl,
  thumbnailUrl,
  origin,
  onClose,
}: StoryVideoPlayerProps) {
  const { top } = useSafeAreaInsets();
  const { player, pan, dismiss, backdropStyle, containerStyle } =
    useStoryControls({
      videoUrl,
      origin,
      onClose,
    });

  return (
    <Modal animationType="none" statusBarTranslucent transparent visible>
      <GestureHandlerRootView style={styles.root}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
        />

        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.videoContainer, containerStyle]}>
            {thumbnailUrl ? (
              <Image
                contentFit="cover"
                source={{ uri: thumbnailUrl }}
                style={StyleSheet.absoluteFill}
              />
            ) : null}

            <VideoView
              allowsPictureInPicture={false}
              contentFit="cover"
              nativeControls={false}
              player={player}
              style={StyleSheet.absoluteFill}
            />

            <Button
              hitSlop={8}
              onPress={dismiss}
              style={[
                styles.iconButton,
                {
                  position: "absolute",
                  top: top + SPACING.sm,
                  right: SPACING.lg,
                },
              ]}
              variant="inverse"
            >
              <BlurView style={StyleSheet.absoluteFillObject} />
              <Octicons color={THEME["foreground-title"]} name="x" size={20} />
            </Button>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.92)",
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#000",
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 38,
    borderCurve: "continuous",
    paddingHorizontal: 0,
    backgroundColor: `${THEME["primary-inverse"]}95`,
    overflow: "hidden",
  },
});
