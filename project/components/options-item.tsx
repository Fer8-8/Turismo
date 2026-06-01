import { Pressable, StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";

type OptionsItemProps = {
  leftIcon?: React.ReactElement;
  text: string;
  rightIcon?: React.ReactElement;
  onPress?: () => void;
  testLabel?: string;
  disabled?: boolean;
};

export function OptionsItem({
  leftIcon,
  text,
  rightIcon,
  onPress,
  testLabel,
  disabled = false,
}: OptionsItemProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={disabled && styles.disabled}
      testID={`options-item-${testLabel}`}
    >
      <Card style={styles.item}>
        <View style={styles.content}>
          {leftIcon}
          <Text>{text}</Text>
        </View>
        {rightIcon}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: RADIUS.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
});
