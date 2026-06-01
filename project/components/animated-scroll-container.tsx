import Animated, {
  type AnimatedScrollViewProps,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEADER_HEIGHT, NAVIGATION_HEIGTH, SPACING, THEME } from "@/lib/theme";

export type ScrollContainerProps = AnimatedScrollViewProps & {};

export function AnimatedScrollContainer({
  style,
  contentContainerStyle,
  ...res
}: ScrollContainerProps) {
  const insets = useSafeAreaInsets();
  const BOTTOM_INSET =
    NAVIGATION_HEIGTH + HEADER_HEIGHT + insets.top + SPACING.xl;

  return (
    <Animated.ScrollView
      contentContainerStyle={[
        { paddingBottom: BOTTOM_INSET },
        contentContainerStyle,
      ]}
      style={[
        {
          backgroundColor: THEME.surface,
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.xl,
        },
        style,
      ]}
      {...res}
    />
  );
}
