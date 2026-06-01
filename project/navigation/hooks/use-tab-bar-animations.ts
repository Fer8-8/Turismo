import { useCallback, useEffect } from "react";
import type { LayoutChangeEvent } from "react-native";
import {
  Easing,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";
import { DETACHED_TABBAR_SPRING_CONFIG } from "@/lib/animations/config/spring";
import { SCREEN_WIDTH } from "@/lib/constants";
import { NAVIGATION_HEIGTH } from "@/lib/theme";
import type { TabMode, TabOptions } from "@/navigation/store/tab-store";

type TabBarAnimationsProps = {
  mode: TabMode;
  options: TabOptions;
  snapPointsInPixels: number[] | null;
  currentSnapIndex: number;
  isGestureActive: SharedValue<boolean>;
};

/**
 * Manage all tab bar animations
 *
 * @param mode - Current tab mode
 * @param options - Tab bar visual options
 * @param snapPointsInPixels - Calculated pixel positions for snap points
 * @param currentSnapIndex - Current snap point index
 * @param isGestureActive - Whether gesture is currently active
 * @returns Animated styles and handlers
 */
export function useTabBarAnimations({
  mode,
  options,
  snapPointsInPixels,
  currentSnapIndex,
  isGestureActive,
}: TabBarAnimationsProps) {
  const height = useSharedValue(NAVIGATION_HEIGTH);

  const animatedBottomSpacing = useDerivedValue(() => {
    return withTiming(options.bottomSpacing, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
  }, [options.bottomSpacing]);

  const animatedWidth = useDerivedValue(() => {
    if (options.width === "default") {
      const width = SCREEN_WIDTH > 350 ? 350 : SCREEN_WIDTH - 15;
      return withSpring(width, DETACHED_TABBAR_SPRING_CONFIG);
    }
    return withSpring(SCREEN_WIDTH, DETACHED_TABBAR_SPRING_CONFIG);
  }, [options.width]);

  const animatedBorderRadius = useDerivedValue(() => {
    const topRadius = mode === "detached" ? 36 : 24;
    const bottomRadius = mode === "detached" ? 36 : 0;

    return {
      top: withTiming(topRadius, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      }),
      bottom: withTiming(bottomRadius, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      }),
    };
  }, [mode]);

  // Height animation that reacts to snap index changes
  // useEffect is required here because currentSnapIndex and mode are plain React
  // values (from Zustand), not shared values — useDerivedValue only re-runs when
  // a *shared value* it reads changes, so it would never fire on store updates.
  useEffect(() => {
    if (
      mode === "detached" &&
      options.enableBottomSheet &&
      snapPointsInPixels &&
      snapPointsInPixels.length > 0
    ) {
      const targetHeight = snapPointsInPixels[currentSnapIndex];
      scheduleOnUI(() => {
        "worklet";
        if (!isGestureActive.value) {
          height.value = withSpring(
            targetHeight,
            DETACHED_TABBAR_SPRING_CONFIG
          );
        }
      });
    }
  }, [
    currentSnapIndex,
    mode,
    options.enableBottomSheet,
    snapPointsInPixels,
    height,
    isGestureActive,
  ]);

  /**
   * Main tab bar styles (width, height, border radius)
   */
  const barStyles = useAnimatedStyle(() => ({
    height: height.value,
    width: animatedWidth.value,
    borderTopLeftRadius: animatedBorderRadius.value.top,
    borderTopRightRadius: animatedBorderRadius.value.top,
    borderBottomLeftRadius: animatedBorderRadius.value.bottom,
    borderBottomRightRadius: animatedBorderRadius.value.bottom,
  }));

  const containerStyles = useAnimatedStyle(() => ({
    bottom: animatedBottomSpacing.value,
  }));

  /**
   * Layout handler for dynamic height calculation
   *
   * When in detached mode, height adapts to content
   * When in navigation mode, height is fixed to NAVIGATION_HEIGTH
   *
   * Only updates height if not in bottom sheet mode, because in
   * bottom sheet mode, height is controlled by snap points
   */
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (options.enableBottomSheet && snapPointsInPixels) {
        return;
      }
      const measuredHeight = event.nativeEvent.layout.height;
      const targetHeight =
        mode === "detached" ? measuredHeight : NAVIGATION_HEIGTH;

      scheduleOnUI(() => {
        "worklet";
        height.value = withSpring(targetHeight, DETACHED_TABBAR_SPRING_CONFIG);
      });
    },
    [options.enableBottomSheet, snapPointsInPixels, mode, height]
  );

  return {
    barStyles,
    containerStyles,
    handleLayout,
    sheetHeight: height,
  };
}

/**
 * Hook to check if backdrop should be shown
 *
 * @param mode - Current tab bar mode
 * @param options - Tab bar options
 * @returns Whether backdrop should be rendered
 */
export function useShouldShowBackdrop(mode: TabMode, options: TabOptions) {
  return mode === "detached" && !!options.outsideTouchAction;
}
