import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { NewPlanPhase } from "../types";

const TIMING = { duration: 180, easing: Easing.out(Easing.quad) };

type AnimatedPlannerBackgroundProps = {
  phase: NewPlanPhase;
  accentColor?: string;
};

export default function AnimatedPlannerBackground({
  phase,
  accentColor = "#FABF51",
}: AnimatedPlannerBackgroundProps) {
  const stateToDates = useSharedValue(0);
  const datesToResults = useSharedValue(0);

  useEffect(() => {
    stateToDates.value = withTiming(phase !== "state" ? 1 : 0, TIMING);
    datesToResults.value = withTiming(phase === "results" ? 1 : 0, TIMING);
  }, [phase, stateToDates, datesToResults]);

  const stateStyle = useAnimatedStyle(() => ({
    opacity: 1 - stateToDates.value,
  }));

  const datesStyle = useAnimatedStyle(() => ({
    opacity: stateToDates.value * (1 - datesToResults.value),
  }));

  const resultsStyle = useAnimatedStyle(() => ({
    opacity: datesToResults.value,
  }));

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFillObject, stateStyle]}>
        <LinearGradient
          colors={["#00A8EF", "#00A8EF", "#7FDCFC", "#F5F5F5"]}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFillObject, datesStyle]}>
        <LinearGradient
          colors={[accentColor, accentColor, accentColor, "#F5F5F5"]}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFillObject, resultsStyle]}>
        <LinearGradient
          colors={["#F5F5F5", "#F5F5F5", "#F5F5F5", "#F5F5F5"]}
          locations={[0, 0.35, 0.7, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </>
  );
}
