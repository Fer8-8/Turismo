import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { type PressableProps, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { HEADER_HEIGHT, SPACING, THEME } from "@/lib/theme";
import { Text } from "../ui/text";

type ScreenHeaderProps = {
  titleKey?: string;
  rightAction?: React.ReactElement;
  backButtonStyles?: PressableProps["style"];
  scrollY?: SharedValue<number>;
  scrollThreshold?: [number, number, number];
};

export function ScreenHeader({
  titleKey,
  rightAction,
  backButtonStyles,
  scrollY,
  scrollThreshold = [0, 50, 100],
}: ScreenHeaderProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  function handleGoBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  const titleAnimatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }

    const opacity = interpolate(
      scrollY.value,
      scrollThreshold,
      [0, 0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      scrollThreshold,
      [10, 10, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  }, [scrollY, scrollThreshold]);

  return (
    <>
      {navigation.canGoBack() && (
        <Button
          hitSlop={6}
          onPress={handleGoBack}
          style={[styles.iconButton, backButtonStyles]}
          variant="inverse"
        >
          <Octicons
            color={THEME["foreground-title"]}
            name="chevron-left"
            size={24}
          />
        </Button>
      )}
      {titleKey && (
        <Animated.View style={titleAnimatedStyle}>
          <Text align="center" variant="subtitle">
            {t(titleKey)}
          </Text>
        </Animated.View>
      )}
      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 38,
    height: 38,
    position: "absolute",
    left: SPACING.lg,
    top: (HEADER_HEIGHT - 38) / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 38,
    paddingHorizontal: 0,
  },
  rightAction: {
    width: 38,
    height: 38,
    position: "absolute",
    right: SPACING.lg,
    top: (HEADER_HEIGHT - 38) / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
  },
});
