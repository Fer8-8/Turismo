import { StyleSheet } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const INACTIVE_WIDTH = 30;
const ACTIVE_WIDTH = 60;
const INACTIVE_COLOR = "#D9D9D9";
const ACTIVE_COLOR = "#000000";

export function PaginationIndicator({
  index,
  animatedIndex,
}: {
  index: number;
  animatedIndex: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(animatedIndex.value) === index;
    return {
      width: withTiming(isActive ? ACTIVE_WIDTH : INACTIVE_WIDTH, {
        duration: 250,
      }),
      backgroundColor: withTiming(isActive ? ACTIVE_COLOR : INACTIVE_COLOR, {
        duration: 250,
      }),
    };
  });

  return <Animated.View style={[styles.indicator, animatedStyle]} />;
}

const styles = StyleSheet.create({
  indicator: {
    height: 2,
    borderRadius: 2,
  },
});
