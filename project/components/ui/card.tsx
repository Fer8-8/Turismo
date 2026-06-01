import { StyleSheet, View, type ViewProps } from "react-native";
import { RADIUS, SPACING, THEME } from "@/lib/theme";

export type CardProps = ViewProps & {
  color?: "default" | "secondary";
};

export function Card({ style, color = "default", ...otherProps }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor:
            color === "default" ? THEME["surface-secondary"] : THEME.surface,
        },
        styles.card,
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderCurve: "continuous",
    padding: SPACING.md,
  },
});
