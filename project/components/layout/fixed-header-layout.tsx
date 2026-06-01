import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { HEADER_HEIGHT, SPACING, THEME } from "@/lib/theme";

type FixedHeaderLayoutProps = {
  children?: React.ReactNode;
  backgroundColor?: string;
  headerHeight?: ViewStyle["height"];
  scrollY?: SharedValue<number>;
  scrollThreshold?: [number, number, number];
  scrolledBackgroundColor?: string; // Color when scrolled
};

export function FixedHeaderLayout({
  children,
  backgroundColor,
  headerHeight,
  scrollY,
  scrollThreshold = [0, 50, 100],
  scrolledBackgroundColor,
}: FixedHeaderLayoutProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (!(scrollY && scrolledBackgroundColor)) {
      return {
        backgroundColor: backgroundColor || THEME.surface,
      };
    }

    const bgColor = interpolateColor(scrollY.value, scrollThreshold, [
      backgroundColor || THEME.surface,
      backgroundColor || THEME.surface,
      scrolledBackgroundColor,
    ]);

    return {
      backgroundColor: bgColor,
    };
  }, [scrollY, scrollThreshold, backgroundColor, scrolledBackgroundColor]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <SafeAreaView edges={["top"]}>
        <View
          style={[styles.header, { height: headerHeight || HEADER_HEIGHT }]}
        >
          {children}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
});
