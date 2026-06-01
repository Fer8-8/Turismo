import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import {
  useShouldShowBackdrop,
  useTabBarAnimations,
} from "@/navigation/hooks/use-tab-bar-animations";
import {
  useBottomSheetState,
  useDetachedContent,
  useTabActions,
  useTabMode,
  useTabOptions,
} from "@/navigation/store/tab-store";
import { useBottomSheetGesture } from "../hooks/use-bottom-sheet-gesture";
import { useSnapPointCalculations } from "../hooks/use-snap-points-calculations";
import { BottomSheetScrollView } from "./bottom-sheet-scroll-view";
import { NavigationButtons } from "./navigation-buttons";

/**
 * CustomTab Component
 *
 * A morphing tab bar that transitions between:
 * - Navigation mode: Standard bottom tab bar
 * - Detached mode: Floating modal with custom content
 * - Bottom sheet mode: Gesture-driven sheet with snap points and scroll support
 */
export function CustomTab(props: BottomTabBarProps) {
  // Android back button handler
  // useTabBarBackHandler();

  const mode = useTabMode();
  const detachedContent = useDetachedContent();
  const tabOptions = useTabOptions();
  const shouldShowBackdrop = useShouldShowBackdrop(mode, tabOptions);
  const { currentSnapIndex } = useBottomSheetState();
  const { snapToIndex } = useTabActions();

  // Shared values for gesture and scroll coordination
  const isGestureActive = useSharedValue(false);
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  // Use state for scroll enabled (controlled from worklet via scheduleOnRN)
  const [enableScroll, setEnableScroll] = useState(false);

  const updateScrollEnabled = useCallback((enabled: boolean) => {
    setEnableScroll(enabled);
  }, []);

  // Sync scroll enabled state when snap index changes programmatically
  // (e.g. expandToMax / collapseToMin). Gesture-driven snaps already call
  // updateScrollEnabled via snapToPoint, so this is a no-op in that path.
  useEffect(() => {
    if (!tabOptions.enableBottomSheet) {
      return;
    }
    const isMax = currentSnapIndex === (tabOptions.snapPoints?.length ?? 0) - 1;
    updateScrollEnabled(isMax);
  }, [
    currentSnapIndex,
    tabOptions.enableBottomSheet,
    tabOptions.snapPoints,
    updateScrollEnabled,
  ]);

  const { snapPointsInPixels } = useSnapPointCalculations(
    tabOptions.snapPoints,
    tabOptions.enableBottomSheet
  );

  const { barStyles, containerStyles, handleLayout, sheetHeight } =
    useTabBarAnimations({
      mode,
      options: tabOptions,
      snapPointsInPixels,
      currentSnapIndex,
      isGestureActive,
    });

  const { handleGesture, contentGesture } = useBottomSheetGesture({
    enabled: tabOptions.enableBottomSheet ?? false,
    snapPointsInPixels,
    currentSnapIndex,
    onSnapIndexChange: snapToIndex,
    sheetPosition: sheetHeight,
    isGestureActive,
    scrollY,
    updateScrollEnabled,
  });

  const handleBackdropPress = useCallback(() => {
    if (tabOptions.outsideTouchAction && mode === "detached") {
      tabOptions.outsideTouchAction();
    }
  }, [mode, tabOptions]);

  // Track whether the tab has ever entered detached mode.
  // This lets us skip the fade-in animation on initial app load,
  // and only delay the appearance of navigation buttons when returning
  // from a modal — giving the height animation time to finish first.
  const hasBeenDetached = useRef(false);
  useEffect(() => {
    if (mode === "detached") {
      hasBeenDetached.current = true;
    }
  }, [mode]);

  const showHandle = tabOptions.enableBottomSheet && mode === "detached";

  return (
    <>
      {/* BACKDROP */}
      {shouldShowBackdrop ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            styles.backdrop,
            { backgroundColor: tabOptions.backdropColor },
          ]}
        >
          <Pressable
            onPress={handleBackdropPress}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}

      <Animated.View style={[styles.container, containerStyles]}>
        <Animated.View
          style={[
            styles.floatingBar,
            barStyles,
            { backgroundColor: tabOptions.backgroundColor },
          ]}
        >
          {/* HANDLE (only in bottom sheet mode) */}
          {showHandle ? (
            <GestureDetector gesture={handleGesture}>
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>
          ) : null}

          {/* CONTENT */}
          <View
            onLayout={handleLayout}
            pointerEvents="box-none"
            style={[tabOptions?.enableBottomSheet && { flex: 1 }]}
          >
            {mode === "navigation" &&
              // Delay the fade-in only when returning from a detached modal,
              // not on initial render where the nav bar should appear instantly.
              (hasBeenDetached.current ? (
                // FadeInDown: opacity 0→1 + slight translateY so the nav
                // slides into place rather than just popping in.
                // Delay of 150ms + 150ms duration = ~300ms total, which lines
                // up with the spring settling time (damping:25, stiffness:260).
                <Animated.View entering={FadeIn.delay(150).duration(125)}>
                  <NavigationButtons {...props} />
                </Animated.View>
              ) : (
                <NavigationButtons {...props} />
              ))}

            {mode === "detached" &&
              detachedContent &&
              (tabOptions.enableBottomSheet ? (
                <>
                  <BottomSheetScrollView
                    contentContainerStyle={styles.scrollContent}
                    contentGesture={contentGesture}
                    scrollEnabled={enableScroll}
                    scrollViewRef={scrollViewRef}
                    scrollY={scrollY}
                  >
                    {detachedContent()}
                  </BottomSheetScrollView>
                  {tabOptions.footerContent && (
                    <View>{tabOptions.footerContent()}</View>
                  )}
                </>
              ) : (
                detachedContent()
              ))}
          </View>
        </Animated.View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBar: {
    borderCurve: "continuous",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  scrollContent: {
    flexGrow: 1,
  },
});
