import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { useMemo, useState } from "react";

type DateRange = {
  start: Date | null;
  end: Date | null;
};

type MonthData = {
  month: Date;
  days: (Date | null)[]; // null = empty cell
};

export function useDateSelection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [lastTappedDate, setLastTappedDate] = useState<Date | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number>(0);

  const isRangeComplete =
    selectedDate !== null ||
    (dateRange.start !== null && dateRange.end !== null);

  const monthsData: MonthData[] = useMemo(() => {
    const today = new Date();
    const months: MonthData[] = [];
    for (let i = 0; i < 6; i++) {
      const monthDate = addMonths(today, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const startDayOfWeek = monthStart.getDay();
      const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

      const days: (Date | null)[] = [
        ...new Array(offset).fill(null),
        ...eachDayOfInterval({ start: monthStart, end: monthEnd }),
      ];

      const totalCells = Math.ceil(days.length / 7) * 7;
      while (days.length < totalCells) {
        days.push(null);
      }

      months.push({
        month: monthDate,
        days,
      });
    }
    return months;
  }, []);

  function handleDayPress(day: Date) {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (
      lastTappedDate &&
      isSameDay(lastTappedDate, day) &&
      now - lastTapTime < DOUBLE_TAP_DELAY
    ) {
      setSelectedDate(day);
      setDateRange({ start: null, end: null });
      setLastTappedDate(null);
      setLastTapTime(0);
    } else if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: day, end: null });
      setSelectedDate(null);
      setLastTappedDate(day);
      setLastTapTime(now);
    } else {
      if (day < dateRange.start) {
        setDateRange({ start: day, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: day });
      }

      setLastTappedDate(day);
      setLastTapTime(now);
    }
  }

  function isDaySelected(day: Date) {
    if (selectedDate && isSameDay(day, selectedDate)) {
      return true;
    }
    if (!dateRange.start) {
      return false;
    }
    if (!dateRange.end) {
      return isSameDay(day, dateRange.start);
    }
    return day >= dateRange.start && day <= dateRange.end;
  }

  function isInRange(day: Date) {
    if (!(dateRange.start && dateRange.end)) {
      return false;
    }
    return day >= dateRange.start && day <= dateRange.end;
  }

  function isRangeStart(day: Date) {
    return dateRange.start !== null && isSameDay(day, dateRange.start);
  }

  function isRangeEnd(day: Date) {
    return dateRange.end !== null && isSameDay(day, dateRange.end);
  }

  return {
    monthsData,
    selectedDate,
    dateRange,
    handleDayPress,
    isDaySelected,
    isRangeComplete,
    isInRange,
    isRangeStart,
    isRangeEnd,
  };
}
