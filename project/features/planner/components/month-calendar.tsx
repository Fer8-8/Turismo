import { endOfMonth, format } from "date-fns";
import { es } from "date-fns/locale";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";
import { DayCell } from "./day-cell";
import { WeekDayHeader } from "./week-day-header";

type MonthCalendarProps = {
  month: Date;
  days: (Date | null)[];
  isDaySelected: (day: Date) => boolean;
  isRangeComplete: boolean;
  isInRange: (day: Date) => boolean;
  isRangeStart: (day: Date) => boolean;
  isRangeEnd: (day: Date) => boolean;
  onDayPress: (day: Date) => void;
};

const weekDays = [
  { label: "L", key: "mon" },
  { label: "M", key: "tue" },
  { label: "M", key: "wed" },
  { label: "J", key: "thu" },
  { label: "V", key: "fri" },
  { label: "S", key: "sat" },
  { label: "D", key: "sun" },
];

export function MonthCalendar({
  month,
  days,
  isDaySelected,
  isRangeComplete,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onDayPress,
}: MonthCalendarProps) {
  return (
    <View style={styles.monthContainer}>
      <Text color="inverse" style={styles.monthTitle} variant="subtitle">
        {format(month, "MMMM", { locale: es })}
      </Text>
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <WeekDayHeader day={day.label} key={day.key} />
        ))}
      </View>
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (!day) {
            const row = Math.floor(index / 7);
            const col = index % 7;
            return (
              <View key={`empty-cell-${row}-${col}`} style={styles.dayCell} />
            );
          }
          const dayIndex = index % 7;
          const selected = isDaySelected(day);
          const inRange = isInRange(day);
          const rangeStart = isRangeStart(day);
          const rangeEnd = isRangeEnd(day);

          return (
            <DayCell
              day={day}
              isFirstInRow={dayIndex === 0 || day.getDate() === 1}
              isInRange={inRange}
              isLastInRow={
                dayIndex === 6 || day.getDate() === endOfMonth(day).getDate()
              }
              isRangeComplete={isRangeComplete}
              isRangeEnd={rangeEnd}
              isRangeStart={rangeStart}
              isSelected={selected}
              key={day.toISOString()}
              onPress={() => onDayPress(day)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  monthContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING["2xl"],
  },
  monthTitle: {
    marginLeft: SPACING.md,
  },
  weekDaysContainer: {
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 16,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});
