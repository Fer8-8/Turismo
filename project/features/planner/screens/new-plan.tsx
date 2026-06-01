import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { LAYOUT } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";
import AnimatedPlannerBackground from "../components/animated-planner-background";
import { NextPhaseButton } from "../components/next-phase-button";
import type { NewPlanPhase } from "../types";
import { DatesSelectorScreen } from "./dates-selector-screen";
import { RecommendationResultsScreen } from "./recommendation-results-screen";
import { StatesSearchScreen } from "./states-search-screen";

export function NewPlan() {
  const { showDetached, dismissDetached } = useTabActions();
  const router = useRouter();

  const [currentPhase, setCurrentPhase] = useState<NewPlanPhase>("state");
  const currentPhaseRef = useRef(currentPhase);

  useEffect(() => {
    currentPhaseRef.current = currentPhase;
  }, [currentPhase]);

  useFocusEffect(
    useCallback(() => {
      showDetached(
        () => (
          <NextPhaseButton
            onPress={() => {
              const phase = currentPhaseRef.current;
              if (phase === "state") {
                setCurrentPhase("dates");
              } else if (phase === "dates") {
                setCurrentPhase("results");
              } else if (phase === "results") {
                router.push("/(tabs)/itinerary/itinerary-map");
              }
            }}
          />
        ),
        { backgroundColor: "transparent" }
      );
      return () => dismissDetached();
    }, [dismissDetached, showDetached, router])
  );

  return (
    <View style={LAYOUT.flex1}>
      <AnimatedPlannerBackground phase={currentPhase} />
      {currentPhase === "state" ? <StatesSearchScreen /> : null}
      {currentPhase === "dates" ? <DatesSelectorScreen /> : null}
      {currentPhase === "results" ? <RecommendationResultsScreen /> : null}
    </View>
  );
}
