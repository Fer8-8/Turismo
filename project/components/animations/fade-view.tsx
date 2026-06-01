import { BlurView } from "expo-blur";
import type React from "react";
import { memo, useEffect } from "react";
import { StyleSheet } from "react-native";
import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type FadeViewProps = ViewProps & {
  delay?: number;
  duration?: number;
  scaleRange?: [number, number];
  translateYRange?: [number, number];
  opacityRange?: [number, number, number];
  blurIntensity?: [number, number, number];
  blurTint?: "light" | "dark" | "default";
  enableBlur?: boolean;
};

export const FadeView: React.FC<FadeViewProps> = memo(function FadeView({
  children,
  delay = 0,
  duration = 800,
  scaleRange = [0.97, 1],
  translateYRange = [10, 0],
  opacityRange = [0, 0.5, 1],
  blurIntensity = [30, 10, 0],
  blurTint = "light",
  enableBlur = true,
  style,
  ...rest
}) {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [delay, duration, animationValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationValue.value,
      [0, 0.8, 1],
      opacityRange,
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      animationValue.value,
      [0, 1],
      scaleRange,
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      animationValue.value,
      [0, 1],
      translateYRange,
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  const blurAnimatedProps = useAnimatedProps(() => {
    const intensity = withSpring(
      interpolate(
        animationValue.value,
        [0, 0.3, 1],
        blurIntensity,
        Extrapolation.CLAMP
      )
    );

    return {
      intensity,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle, style]} {...rest}>
      {children}
      {enableBlur && (
        <AnimatedBlurView
          animatedProps={blurAnimatedProps}
          pointerEvents="none"
          style={StyleSheet.absoluteFillObject}
          tint={blurTint}
        />
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {},
});

FadeView.displayName = "FadeView";
