import { useState } from "react";
import { StyleSheet } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Text } from "@/components/ui/text";

type VideoSeekOverlayProps = {
  previewTime: SharedValue<number>;
  duration: SharedValue<number>;
  isScrubbing: SharedValue<boolean>;
};

export function VideoSeekOverlay({
  previewTime,
  duration,
  isScrubbing,
}: VideoSeekOverlayProps) {
  const [text, setText] = useState("");

  const formattedTime = useDerivedValue(() => {
    const current = previewTime.value;
    const total = duration.value;

    function format(sec: number) {
      const mins = Math.floor(sec / 60);
      const secs = Math.floor(sec % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    return `${format(current)} / ${format(total)}`;
  });

  useAnimatedReaction(
    () => formattedTime.value,
    (value) => {
      scheduleOnRN(setText, value);
    }
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isScrubbing.value ? 1 : 0, { duration: 150 }),
    transform: [
      {
        scale: withTiming(isScrubbing.value ? 1 : 0.9, {
          duration: 150,
        }),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      <Animated.View>
        <Text color="inverse" style={styles.text} variant="subtitle">
          {text}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  text: {
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
