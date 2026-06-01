import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";

type BadgeProps = {
  label: string;
  color?: string;
  withIndicator?: boolean;
};

export function Badge({
  label,
  color = "#0A4B8C",
  withIndicator = false,
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      {withIndicator ? (
        <View style={[styles.dot, { backgroundColor: color }]} />
      ) : null}
      <Text style={[styles.label, { color }]} variant="caption">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: RADIUS.full,
  },
  label: {
    letterSpacing: 0.3,
  },
});
