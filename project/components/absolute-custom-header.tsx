import { StyleSheet, View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ABSOLUTE_CUSTOM_HEADER_HEIGHT, SPACING } from "@/lib/theme";

type AbsoluteCustomHeaderProps = ViewProps & {
  children: React.ReactNode;
};

export function AbsoluteCustomHeader({
  children,
  style,
  ...props
}: AbsoluteCustomHeaderProps) {
  const topPadding = useSafeAreaInsets().top;

  return (
    <View
      style={[styles.container, { paddingTop: topPadding }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    backgroundColor: "transparent",
    width: "100%",
    height: ABSOLUTE_CUSTOM_HEADER_HEIGHT,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
});
