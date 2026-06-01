import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { FullPageContainer } from "@/components/full-page-container";
import { Text } from "@/components/ui/text";
import { fadeScaleUpSpringEnter } from "@/lib/animations/enter";
import { LAYOUT, SPACING } from "@/lib/theme";
import { CalendarSelector } from "../components/calendar-selector";
import { DateModeSelector } from "../components/date-mode-selector";
import { DaysSelector } from "../components/days-selector";
import type { DateMode } from "../types";

export function DatesSelectorScreen() {
  const [mode, setMode] = useState<DateMode>("calendar");

  return (
    <FullPageContainer style={styles.content}>
      <Animated.View
        entering={fadeScaleUpSpringEnter({
          initialTranslateY: 32,
          initialScale: 0.92,
          delay: 100,
        })}
        style={LAYOUT.flex1}
      >
        <View style={styles.header}>
          <Text color="inverse" variant="subtitle">
            {mode === "days" ? "¿Cuántos días?" : "¿En qué fechas?"}
          </Text>

          <DateModeSelector setMode={setMode} />
        </View>
        {mode === "days" ? <DaysSelector /> : <CalendarSelector />}
      </Animated.View>
    </FullPageContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
