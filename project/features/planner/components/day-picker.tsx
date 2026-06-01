import type React from "react";
import { useCallback, useRef } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { haptics } from "@/lib/haptics";
import { CONTAINER_WIDTH, ITEM_TOTAL, SIDE_PADDING } from "../constants/picker";
import { DayCell } from "./day-picker-cell";

export type DayPickerProps = {
  /** Array of day numbers to display, e.g. [1..31] */
  days: number[];
  /** Index to start on (default 0) */
  initialIndex?: number;
  /** Fires whenever the centered day changes */
  onSelect?: (value: number, index: number) => void;
  /** Optional container style override */
  style?: ViewStyle;
};

export const DayPicker: React.FC<DayPickerProps> = ({
  days,
  initialIndex = 0,
  onSelect,
  style,
}) => {
  const scrollX = useSharedValue(initialIndex * ITEM_TOTAL);
  const lastIndex = useRef(initialIndex);

  const triggerHaptic = useCallback(() => {
    haptics.tap();
  }, []);

  const notifySelect = useCallback(
    (raw: number) => {
      const index = Math.max(0, Math.min(raw, days.length - 1));
      if (index !== lastIndex.current) {
        lastIndex.current = index;
        triggerHaptic();
        onSelect?.(days[index], index);
      }
    },
    [days, onSelect, triggerHaptic]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      const index = Math.round(e.contentOffset.x / ITEM_TOTAL);
      scheduleOnRN(notifySelect, index);
    },
  });

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        contentOffset={{ x: initialIndex * ITEM_TOTAL, y: 0 }}
        decelerationRate="fast"
        horizontal
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_TOTAL}
      >
        {days.map((day, index) => (
          <DayCell
            index={index}
            key={String(day)}
            scrollX={scrollX}
            value={day}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: CONTAINER_WIDTH,
    height: 100,
    alignSelf: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: SIDE_PADDING,
    alignItems: "center",
  },
});
