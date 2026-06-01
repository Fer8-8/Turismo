import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { RADIUS } from "@/lib/theme";

export function EventDay({ date }: { date: string }) {
  const evenDate = new Date(date);

  const month = evenDate.toLocaleDateString("es-MX", {
    month: "short",
  });

  const day = evenDate.toLocaleDateString("es-MX", {
    day: "2-digit",
  });

  return (
    <View style={styles.container}>
      <Text color="inverse" variant="caption">
        {month}
      </Text>
      <Text color="inverse" variant="title">
        {day}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    backgroundColor: "#F54900",
    borderRadius: RADIUS.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
});
