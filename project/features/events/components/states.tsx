import { Image } from "expo-image";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";

type Props = {
  image: string;
  title: string;
  selected?: boolean;
  onPress: () => void;
  width: number;
  height: number;
};

export function WorldCupStates({
  image,
  title,
  selected = false,
  onPress,
  width,
  height,
}: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, {
      damping: 20,
      stiffness: 220,
      mass: 0.7,
    });
  }, [selected, progress]);

  const imageStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.8]);
    const translateY = interpolate(progress.value, [0, 1], [0, -10]);

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.15]);
    const opacity = interpolate(progress.value, [0, 1], [0.75, 1]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <View style={{ alignItems: "center" }}>
        <Animated.View style={imageStyle}>
          <Image
            contentFit="contain"
            source={image}
            style={{
              width,
              height,
              tintColor: selected ? "black" : undefined,
            }}
          />
        </Animated.View>

        <Animated.View style={[textStyle, { marginTop: SPACING.xs }]}>
          <Text
            color={selected ? "title" : "foreground"}
            style={{
              fontWeight: selected ? "600" : "400",
            }}
          >
            {title}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}
