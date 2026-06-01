/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — HomeHeader
 *
 * scrollY < 160px   logo centered, search hidden
 * scrollY ≥ 160px   logo snaps to left edge, search appears (right edge)
 *                  — always full-speed, independent of scroll velocity
 * ───────────────────────────────────────────────────────── */

import { Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { RADIUS, THEME } from "@/lib/theme";

// Threshold for activating the animation
const SCROLL = {
  threshold: 160,
};

// Spring configs
const SPRING = {
  logo: { damping: 26, stiffness: 220, mass: 1.2 }, // logo slides left
  search: { damping: 28, stiffness: 260, mass: 1.0 }, // search pops in
};

const LOGO_W = 60; // logo width
const SEARCH_W = 38; // search button width

type HomeHeaderProps = {
  scrollY: SharedValue<number>;
};

export function HomeHeader({ scrollY }: HomeHeaderProps) {
  const containerWidth = useSharedValue(0);

  // Single boolean-like derived value that drives everything
  const expanded = useDerivedValue(() =>
    scrollY.value >= SCROLL.threshold ? 1 : 0
  );

  const logoStyle = useAnimatedStyle(() => {
    // In centered state: translateX = 0
    // In expanded state: move left so logo sits at left edge
    // Left edge from center = -(containerWidth/2 - logoWidth/2)
    const targetX = -(containerWidth.value / 2 - LOGO_W / 2);
    const translateX = withSpring(
      expanded.value === 1 ? targetX : 0,
      SPRING.logo
    );
    return { transform: [{ translateX }] };
  });

  const searchStyle = useAnimatedStyle(() => {
    const opacity = withSpring(expanded.value, SPRING.search);
    const translateX = withSpring(
      expanded.value === 1 ? 0 : SEARCH_W / 2,
      SPRING.search
    );
    return { opacity, transform: [{ translateX }] };
  });

  return (
    <FixedHeaderLayout headerHeight={56}>
      <View
        onLayout={(e) => {
          containerWidth.value = e.nativeEvent.layout.width;
        }}
        style={styles.container}
      >
        <Animated.View style={logoStyle}>
          <Image
            source={require("@/assets/images/logos/explore-mx-logo.png")}
            style={styles.logo}
          />
        </Animated.View>

        <Animated.View style={[styles.searchWrapper, searchStyle]}>
          <Link asChild href="/home/search">
            <Pressable style={styles.searchLink}>
              <Octicons color={THEME.primary} name="search" size={20} />
            </Pressable>
          </Link>
        </Animated.View>
      </View>
    </FixedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: LOGO_W,
    height: 46,
  },
  searchWrapper: {
    position: "absolute",
    right: 0,
  },
  searchLink: {
    width: SEARCH_W,
    height: SEARCH_W,
    borderRadius: RADIUS.full,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME["primary-inverse"],
  },
});
