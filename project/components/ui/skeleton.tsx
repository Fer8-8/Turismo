"use client";

import { useEffect } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { RADIUS, THEME } from "@/lib/theme";

const AnimatedView = Animated.createAnimatedComponent(View);

export type SkeletonProps = ViewProps & {};

export function Skeleton({ style, ...props }: SkeletonProps) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.5, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedView style={[styles.card, animatedStyle, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME["surface-secondary"],
    borderRadius: RADIUS.xl,
    borderCurve: "continuous",
  },
});
