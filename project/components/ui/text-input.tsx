import {
  TextInput as RNTextInput,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { FONT, SIZE, SPACING, THEME } from "@/lib/theme";

export type InputProps = TextInputProps & {};

export const TextInput = ({
  style,
  multiline,
  editable = true,
  ...rest
}: InputProps) => {
  return (
    <RNTextInput
      editable={editable}
      multiline={multiline}
      placeholderTextColor={THEME["foreground-muted"]}
      scrollEnabled={false}
      style={[
        styles.input,
        multiline && styles.multilineInput,
        !editable && styles.disabled,
        style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: SIZE.button,
    borderRadius: SIZE.button,
    borderCurve: "continuous",
    paddingHorizontal: SPACING.xl,
    fontFamily: FONT.family,
    backgroundColor: THEME["surface-secondary"],
    color: THEME.foreground,
  },
  multilineInput: {
    height: 120,
    borderRadius: SPACING.lg,
    paddingVertical: SPACING.lg,
    textAlignVertical: "top",
    fontFamily: FONT.family,
  },
  disabled: {
    opacity: 0.4,
  },
});
