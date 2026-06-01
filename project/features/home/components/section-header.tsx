import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";

type TextProps = {
  title?: string;
  rightText?: string;
  onPressRightText?: () => void;
};

export function SectionHeader({
  title,
  rightText,
  onPressRightText,
}: TextProps) {
  return (
    <View style={styles.content}>
      <Text>{title}</Text>

      {rightText && onPressRightText && (
        <Pressable onPress={onPressRightText} style={styles.subtitleContainer}>
          <Text color="muted" variant="bodySmall">
            {rightText}
          </Text>
          <Ionicons
            color={THEME["foreground-muted"]}
            name="chevron-forward"
            size={12}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
