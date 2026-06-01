import Octicons from "@expo/vector-icons/Octicons";
import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { THEME } from "@/lib/theme";

type HeaderButtonIconProps = {
  onPress?: () => void;
  iconName?: ComponentProps<typeof Octicons>["name"];
  iconSize?: number;
};

export function HeaderButtonIcon({
  onPress,
  iconName,
  iconSize,
}: HeaderButtonIconProps) {
  return (
    <Button
      hitSlop={6}
      onPress={onPress}
      style={styles.iconButton}
      variant="inverse"
    >
      <Octicons
        color={THEME["foreground-title"]}
        name={iconName}
        size={iconSize || 24}
      />
    </Button>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
  },
});
