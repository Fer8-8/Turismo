import type { ReactNode } from "react";
import { Pressable, type PressableProps, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RADIUS, RED, SPACING, THEME } from "@/lib/theme";
import { Text } from "./text";

export type ButtonProps = PressableProps & {
  variant?: "default" | "inverse" | "secondary" | "danger";
  children?: ReactNode;
  disablePressAnimation?: boolean;
};

const TEXT_COLOR = {
  default: THEME["primary-foreground"],
  inverse: THEME["primary-inverse-foreground"],
  secondary: THEME.foreground,
  danger: THEME["primary-foreground"],
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  style,
  variant = "default",
  children,
  disabled,
  disablePressAnimation = false,
  ...rest
}: ButtonProps) => {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (reduceMotion || disablePressAnimation) {
      return;
    }

    scale.value = withSpring(0.98, {
      damping: 20,
      stiffness: 300,
      mass: 1,
    });
  };

  const handlePressOut = () => {
    if (reduceMotion || disablePressAnimation) {
      return;
    }

    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
      mass: 1,
    });
  };

  return (
    <AnimatedPressable
      accessibilityLabel={
        typeof children === "string" ? children : rest.accessibilityLabel
      }
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      android_ripple={null}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.btn,
        variant === "default" && { backgroundColor: THEME.primary },
        variant === "secondary" && { backgroundColor: THEME.surface },
        variant === "inverse" && { backgroundColor: THEME["primary-inverse"] },
        variant === "danger" && { backgroundColor: RED["500"] },
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            {
              color: TEXT_COLOR[variant],
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: RADIUS.full,
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    borderCurve: "continuous",
  },
  disabled: {
    opacity: 0.4,
  },
});
