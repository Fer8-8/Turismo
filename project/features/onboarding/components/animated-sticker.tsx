import { Image, type ImageProps } from "expo-image";
import { useEffect } from "react";
import type { ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

type AnimatedStickerProps = {
  source: ImageProps["source"];
  style: ViewProps["style"];
  imageStyle: ImageProps["style"];
  delay?: number;
  initialScale?: number;
  initialRotation?: number;
  initialTranslateY?: number;
  rotation?: string;
};

export function AnimatedSticker({
  source,
  style,
  imageStyle,
  delay = 0,
  initialRotation = 0,
  initialScale = 0,
  initialTranslateY = 30,
  rotation = "0deg",
}: AnimatedStickerProps) {
  const scale = useSharedValue(initialScale);
  const rotate = useSharedValue(initialRotation);
  const translateY = useSharedValue(initialTranslateY);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(1, {
        damping: 15,
        stiffness: 170,
        mass: 1,
      })
    );
    rotate.value = withDelay(
      delay,
      withSpring(1, {
        damping: 7,
        stiffness: 210,
        mass: 1,
      })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 40,
        stiffness: 250,
        mass: 1.2,
      })
    );
    opacity.value = withDelay(
      delay,
      withSpring(1, {
        damping: 40,
        stiffness: 250,
        mass: 1,
      })
    );
  }, [rotate, delay, scale, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotationValue = Number.parseFloat(rotation);

    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value * rotationValue}deg` },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Image source={source} style={imageStyle} />
    </Animated.View>
  );
}
