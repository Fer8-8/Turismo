import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";

type WeekDayHeaderProps = {
  day: string;
};

export function WeekDayHeader({ day }: WeekDayHeaderProps) {
  return (
    <View style={styles.weekDayCell}>
      <Text style={styles.day} variant="bodySmall">
        {day}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  weekDayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  day: {
    color: "#ffffff95",
  },
});
