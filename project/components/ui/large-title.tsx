import {
  Text as RNText,
  StyleSheet,
  type TextProps,
  type TextStyle,
} from "react-native";
import { FONT, THEME } from "@/lib/theme";

export type ThemedTextProps = TextProps & {
  align?: TextStyle["textAlign"];
  fontWeight?: TextStyle["fontWeight"];
  disabled?: boolean;
};

export function LargeTitle({
  style,
  align,
  fontWeight,
  disabled = false,
  ...rest
}: ThemedTextProps) {
  return (
    <RNText
      accessibilityState={{ disabled }}
      style={[
        styles.text,
        align && { textAlign: align },
        fontWeight && { fontWeight },
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 26,
    fontFamily: FONT.family,
    fontWeight: "bold",
    color: THEME["foreground-title"],
  },
  disabled: {
    opacity: 0.4,
  },
});
