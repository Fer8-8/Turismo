import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Card } from "@/components/ui/card";
import { AnimatedText } from "@/components/ui/text";
import { RADIUS, SPACING, THEME } from "@/lib/theme";
import type { DateMode } from "../types";

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 180,
  mass: 1,
};

type DateModeSelectorProps = {
  setMode: (mode: DateMode) => void;
};

export function DateModeSelector({ setMode }: DateModeSelectorProps) {
  const translateX = useSharedValue(0);
  const backgroundWidth = useSharedValue(0);
  const calendarProgress = useSharedValue(1);
  const daysProgress = useSharedValue(0);
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>(
    []
  );

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: backgroundWidth.value,
  }));

  const animatedCalendarTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      calendarProgress.value,
      [0, 1],
      [THEME.foreground, "#fff"]
    ),
  }));

  const animatedDaysTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      daysProgress.value,
      [0, 1],
      [THEME.foreground, "#fff"]
    ),
  }));

  function handleSelect(selected: DateMode) {
    setMode(selected);
    const index = selected === "calendar" ? 0 : 1;
    const layout = tabLayouts[index];
    if (!layout) {
      return;
    }

    translateX.value = withSpring(layout.x, SPRING_CONFIG);
    backgroundWidth.value = withSpring(layout.width, SPRING_CONFIG);
    calendarProgress.value = withTiming(selected === "calendar" ? 1 : 0, {
      duration: 300,
    });
    daysProgress.value = withTiming(selected === "days" ? 1 : 0, {
      duration: 300,
    });
  }

  function handleTabLayout(index: number, x: number, width: number) {
    setTabLayouts((prev) => {
      const next = [...prev];
      next[index] = { x, width };
      if (index === 0) {
        translateX.value = x;
        backgroundWidth.value = width;
      }
      return next;
    });
  }

  return (
    <Card style={styles.selector}>
      <View style={styles.inner}>
        <Animated.View
          style={[styles.tabBackground, animatedBackgroundStyle]}
        />
        <Pressable
          onLayout={(e) =>
            handleTabLayout(
              0,
              e.nativeEvent.layout.x,
              e.nativeEvent.layout.width
            )
          }
          onPress={() => handleSelect("calendar")}
          style={styles.tab}
        >
          <AnimatedText style={animatedCalendarTextStyle} variant="caption">
            Calendario
          </AnimatedText>
        </Pressable>
        <Pressable
          onLayout={(e) =>
            handleTabLayout(
              1,
              e.nativeEvent.layout.x,
              e.nativeEvent.layout.width
            )
          }
          onPress={() => handleSelect("days")}
          style={styles.tab}
        >
          <AnimatedText style={animatedDaysTextStyle} variant="caption">
            Días
          </AnimatedText>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  selector: {
    alignSelf: "center",
    padding: RADIUS.xs,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.sm,
  },
  tab: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabBackground: {
    backgroundColor: "#FABF51",
    position: "absolute",
    height: "100%",
    borderRadius: RADIUS.full,
  },
});
