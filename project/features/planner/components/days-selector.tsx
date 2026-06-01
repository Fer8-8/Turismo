import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { getDayLabel } from "../utils";
import { DayPicker } from "./day-picker";

export function DaysSelector() {
  const [value, setValue] = useState(3);
  const label = getDayLabel(value);

  const handleSelect = useCallback((val: number) => setValue(val), []);

  return (
    <View style={styles.container}>
      <DayPicker
        days={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        initialIndex={2}
        onSelect={handleSelect}
      />

      {label && (
        <Animated.View
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(140)}
          key={value}
          style={styles.labelContainer}
        >
          <Text align="center" color="inverse" variant="title">
            {label.subtitle}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: NAVIGATION_HEIGTH,
    gap: 20,
  },
  labelContainer: {
    alignItems: "center",
    paddingHorizontal: SPACING["2xl"],
    height: 68,
  },
});
