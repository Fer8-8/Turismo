import type { StyleProp } from "react-native";
import type { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import Animated, {
  type AnimatedStyle,
  type WithSpringConfig,
} from "react-native-reanimated";
import { fadeScaleUpSpringEnter } from "@/lib/animations/enter";
import { fadeScaleDownSpringExit } from "@/lib/animations/exit";

type AnimatedModalContentProps = {
  children: React.ReactNode;
  enterSpringConfig?: WithSpringConfig & { delay?: number };
  exitSpringConfig?: WithSpringConfig & { delay?: number };
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
};

export function AnimatedModalContent({
  children,
  style,
  enterSpringConfig,
  exitSpringConfig,
}: AnimatedModalContentProps) {
  return (
    <Animated.View
      entering={fadeScaleUpSpringEnter({
        ...enterSpringConfig,
        delay: enterSpringConfig?.delay ?? 10,
      })}
      exiting={fadeScaleDownSpringExit(exitSpringConfig)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
