import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { useDateSelection } from "../hooks/use-date-selection";
import { MonthCalendar } from "./month-calendar";

export function CalendarSelector() {
  const {
    monthsData,
    handleDayPress,
    isDaySelected,
    isRangeComplete,
    isInRange,
    isRangeStart,
    isRangeEnd,
  } = useDateSelection();

  return (
    <FlashList
      contentContainerStyle={styles.list}
      data={monthsData}
      keyExtractor={(item) => item.month.toISOString()}
      renderItem={({ item }) => (
        <MonthCalendar
          days={item.days}
          isDaySelected={isDaySelected}
          isInRange={isInRange}
          isRangeComplete={isRangeComplete}
          isRangeEnd={isRangeEnd}
          isRangeStart={isRangeStart}
          month={item.month}
          onDayPress={handleDayPress}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: NAVIGATION_HEIGTH,
    marginTop: SPACING["3xl"],
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
