import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { SPACING } from "@/lib/theme";
import { PaginationIndicator } from "./pagination-indicator";

const TOTAL_STEPS = 3;

type OnboardingAnimatedPaginationProps = {
  currentStep: number;
};

export function OnboardingAnimatedPagination({
  currentStep,
}: OnboardingAnimatedPaginationProps) {
  const animatedIndex = useSharedValue(currentStep - 1);

  useEffect(() => {
    animatedIndex.value = withTiming(currentStep - 1, {
      duration: 100,
    });
  }, [currentStep, animatedIndex]);

  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((item, index) => (
        <PaginationIndicator
          animatedIndex={animatedIndex}
          index={index}
          key={`${item}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.sm,
  },
});
