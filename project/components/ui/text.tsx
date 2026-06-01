import {
  Text as RNText,
  StyleSheet,
  type TextProps,
  type TextStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { FONT, THEME } from "@/lib/theme";

export type ThemedTextProps = TextProps & {
  color?: "foreground" | "muted" | "inverse" | "inverse-muted" | "title";
  variant?: "caption" | "body" | "bodySmall" | "subtitle" | "title" | "display";
  align?: TextStyle["textAlign"];
  fontWeight?: TextStyle["fontWeight"];
  disabled?: boolean;
};

export function Text({
  style,
  color,
  variant = "body",
  align,
  fontWeight,
  disabled = false,
  accessibilityLabel,
  ...rest
}: ThemedTextProps) {
  return (
    <RNText
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={[
        styles.text,
        variant === "caption" && styles.caption,
        variant === "body" && styles.body,
        variant === "bodySmall" && styles.bodySmall,
        variant === "subtitle" && styles.subtitle,
        variant === "title" && styles.title,
        variant === "display" && styles.display,
        color === "foreground" && { color: THEME.foreground },
        color === "muted" && { color: THEME["foreground-muted"] },
        color === "inverse" && { color: THEME["primary-foreground"] },
        color === "inverse-muted" && { color: "#DEDEDE" },
        color === "title" && { color: THEME["foreground-title"] },
        align && { textAlign: align },
        fontWeight && { fontWeight },
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    />
  );
}
export const AnimatedText = Animated.createAnimatedComponent(Text);

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT.family,
  },
  caption: {
    fontSize: FONT.caption,
    fontWeight: "500",
    color: THEME["foreground-muted"],
  },
  bodySmall: {
    fontSize: FONT["body-small"],
    fontWeight: "500",
    color: THEME.foreground,
  },
  body: {
    fontSize: FONT.body,
    fontWeight: "500",
    color: THEME.foreground,
  },
  subtitle: {
    fontSize: FONT.subtitle,
    fontWeight: "600",
    color: THEME["foreground-title"],
  },
  title: {
    fontSize: FONT.title,
    fontWeight: "600",
    color: THEME["foreground-title"],
  },
  display: {
    fontSize: FONT.display,
    fontWeight: "800",
    color: THEME["foreground-title"],
  },
  disabled: {
    opacity: 0.4,
  },
});
