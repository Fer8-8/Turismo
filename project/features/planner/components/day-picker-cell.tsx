import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { AnimatedText } from "@/components/ui/text";
import { ITEM_SPACING, ITEM_TOTAL, ITEM_WIDTH } from "../constants/picker";

type CellProps = {
  value: number;
  index: number;
  scrollX: SharedValue<number>;
};

export function DayCell({ value, index, scrollX }: CellProps) {
  const center = index * ITEM_TOTAL;

  const containerStyle = useAnimatedStyle(() => {
    const d = scrollX.value - center;

    const translateY = interpolate(
      d,
      [-ITEM_TOTAL * 2, -ITEM_TOTAL, 0, ITEM_TOTAL, ITEM_TOTAL * 2],
      [10, 5, 0, 5, 10],
      Extrapolation.CLAMP
    );

    return { transform: [{ translateY }] };
  });

  const textStyle = useAnimatedStyle(() => {
    const d = Math.abs(scrollX.value - center);

    // Active: 96px full white. Each step out gets smaller and more transparent.
    const fontSize = interpolate(
      d,
      [0, ITEM_TOTAL, ITEM_TOTAL * 2],
      [96, 26, 18],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      d,
      [0, ITEM_TOTAL * 0.4, ITEM_TOTAL, ITEM_TOTAL * 2],
      [1, 0.9, 0.25, 0.12],
      Extrapolation.CLAMP
    );

    const fontWeight = d < ITEM_TOTAL * 0.5 ? "700" : "400";

    return {
      fontSize,
      opacity,
      fontWeight,
      color: "#FFFFFF",
    };
  });

  return (
    <Animated.View style={[styles.cell, containerStyle]}>
      <AnimatedText style={[styles.cellText, textStyle]}>{value}</AnimatedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: ITEM_WIDTH,
    marginRight: ITEM_SPACING,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  cellText: {
    letterSpacing: -2,
    textAlign: "center",
    includeFontPadding: false,
  },
});
