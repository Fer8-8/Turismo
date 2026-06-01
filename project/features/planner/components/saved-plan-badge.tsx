import { Octicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";

type CollageBage = {
  text: string;
};

export function SavedPlanBadge({ text }: CollageBage) {
  return (
    <View style={styles.badge}>
      <Octicons color={THEME["foreground-muted"]} name="pin" size={12} />
      <Text style={styles.badgeText} variant="caption">
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: `${THEME.foreground}10`,
    borderRadius: 14,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: THEME["foreground-muted"],
  },
});
