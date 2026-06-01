import { format } from "date-fns";
import { memo, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AnimatedText, Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";

const SHAPE_SPRING_CONFIG = {
  damping: 19,
  stiffness: 220,
  mass: 1,
};

type DayCellProps = {
  day: Date;
  isSelected: boolean;
  isRangeComplete: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isFirstInRow: boolean;
  isLastInRow: boolean;
  onPress: () => void;
};

export const DayCell = memo(function Component({
  day,
  isSelected,
  isRangeComplete,
  isRangeStart,
  isRangeEnd,
  isInRange,
  isFirstInRow,
  isLastInRow,
  onPress,
}: DayCellProps) {
  const isMiddleRangeDay =
    isInRange && !isRangeStart && !isRangeEnd && isRangeComplete;

  const shapeScale = useSharedValue(isSelected ? 1 : 0);
  const shapeOpacity = useSharedValue(isSelected ? 1 : 0);
  const shapeBorderRadius = useSharedValue(
    isSelected && !isRangeComplete ? SPACING.md : SPACING.xl
  );
  const rangeOpacity = useSharedValue(isInRange && isRangeComplete ? 1 : 0);
  const middleTextProgress = useSharedValue(isMiddleRangeDay ? 1 : 0);

  useEffect(() => {
    if (isSelected) {
      shapeScale.value = withSpring(1, SHAPE_SPRING_CONFIG);
      shapeOpacity.value = withTiming(1, { duration: 150 });
    } else {
      shapeScale.value = withSpring(0, SHAPE_SPRING_CONFIG);
      shapeOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [isSelected, shapeScale, shapeOpacity]);

  useEffect(() => {
    shapeBorderRadius.value = withSpring(
      isRangeComplete ? SPACING.xl : SPACING.md,
      SHAPE_SPRING_CONFIG
    );
  }, [isRangeComplete, shapeBorderRadius]);

  useEffect(() => {
    rangeOpacity.value = withDelay(
      150,
      withTiming(isInRange && isRangeComplete ? 1 : 0, { duration: 250 })
    );
    middleTextProgress.value = withDelay(
      150,
      withTiming(isMiddleRangeDay ? 1 : 0, { duration: 250 })
    );
  }, [
    isInRange,
    isRangeComplete,
    rangeOpacity,
    isMiddleRangeDay,
    middleTextProgress,
  ]);

  const animatedShapeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shapeScale.value }],
    opacity: shapeOpacity.value,
    borderRadius: shapeBorderRadius.value,
  }));

  const animatedRangeStyle = useAnimatedStyle(() => ({
    opacity: rangeOpacity.value,
  }));

  const animatedMiddleTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(middleTextProgress.value, [0, 1], ["#fff", "#000"]),
  }));

  function getShape() {
    if (isMiddleRangeDay) {
      return null;
    }
    if (isSelected) {
      return styles.selectedDay;
    }
    return null;
  }

  function getMiddleRangeBackground() {
    if (isFirstInRow && isLastInRow) {
      return styles.rangeBackgroundMiddleFirstDaySingle;
    }
    if (isFirstInRow) {
      return styles.rangeBackgroundMiddleLeft;
    }
    if (isLastInRow) {
      return styles.rangeBackgroundMiddleRight;
    }
    return styles.rangeBackgroundMiddle;
  }

  function getRangeBackground() {
    if (!(isInRange && isRangeComplete) || (isRangeStart && isRangeEnd)) {
      return null;
    }
    if (isRangeStart) {
      return isLastInRow ? null : styles.rangeBackgroundStart;
    }
    if (isRangeEnd) {
      return isFirstInRow ? null : styles.rangeBackgroundEnd;
    }
    return getMiddleRangeBackground();
  }

  function getTextColor() {
    if (isRangeStart || isRangeEnd) {
      return "title";
    }
    return "inverse";
  }

  const rangeBackground = getRangeBackground();
  const shape = getShape();

  return (
    <View style={styles.dayCell}>
      {rangeBackground && (
        <Animated.View style={[rangeBackground, animatedRangeStyle]} />
      )}
      <Pressable onPress={onPress} style={styles.dayPressable}>
        <View style={styles.dayCircle}>
          {shape && (
            <Animated.View
              style={[StyleSheet.absoluteFill, shape, animatedShapeStyle]}
            />
          )}
          {isMiddleRangeDay ? (
            <AnimatedText style={animatedMiddleTextStyle}>
              {format(day, "d")}
            </AnimatedText>
          ) : (
            <Text color={getTextColor()}>{format(day, "d")}</Text>
          )}
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  selectedDay: {
    backgroundColor: THEME["surface-secondary"],
  },
  selectedText: {
    color: THEME["primary-inverse-foreground"],
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dayPressable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rangeBackgroundStart: {
    position: "absolute",
    height: 40,
    left: "50%",
    right: 0,
    backgroundColor: THEME["surface-secondary"],
  },
  rangeBackgroundEnd: {
    position: "absolute",
    height: 40,
    left: 0,
    right: "50%",
    backgroundColor: THEME["surface-secondary"],
  },
  rangeBackgroundMiddle: {
    position: "absolute",
    height: 40,
    left: 0,
    right: 0,
    backgroundColor: THEME["surface-secondary"],
  },
  rangeBackgroundMiddleLeft: {
    position: "absolute",
    height: 40,
    left: 0,
    right: 0,
    backgroundColor: THEME["surface-secondary"],
    borderTopLeftRadius: SPACING.xl,
    borderBottomLeftRadius: SPACING.xl,
  },
  rangeBackgroundMiddleRight: {
    position: "absolute",
    height: 40,
    left: 0,
    right: 0,
    backgroundColor: THEME["surface-secondary"],
    borderTopRightRadius: SPACING.xl,
    borderBottomRightRadius: SPACING.xl,
  },
  rangeBackgroundMiddleFirstDaySingle: {
    position: "absolute",
    height: 40,
    left: 0,
    right: 0,
    backgroundColor: THEME["surface-secondary"],
    borderRadius: SPACING.xl,
  },
});
