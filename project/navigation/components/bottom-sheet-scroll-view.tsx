import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  type AnimatedRef,
  type SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

type BottomSheetScrollViewProps = {
  children: ReactNode;
  scrollY: SharedValue<number>;
  scrollEnabled: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: add missing type
  contentGesture: any;
  scrollViewRef: AnimatedRef<Animated.ScrollView>;
  contentContainerStyle?: ViewStyle;
};

/**
 * ScrollView wrapper for bottom sheet content
 *
 * This component wraps your scrollable content and handles:
 * - Scroll position tracking
 * - Scroll enable/disable based on sheet state
 * - Simultaneous gestures for scroll + sheet dragging
 */
export function BottomSheetScrollView({
  children,
  scrollY,
  scrollEnabled,
  contentGesture,
  scrollViewRef,
  contentContainerStyle,
}: BottomSheetScrollViewProps) {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <GestureDetector gesture={contentGesture}>
      <Animated.ScrollView
        bounces={false}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        onScroll={scrollHandler}
        overScrollMode="never"
        ref={scrollViewRef}
        scrollEnabled={scrollEnabled}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  );
}
