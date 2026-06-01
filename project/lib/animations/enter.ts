import {
  type WithSpringConfig,
  withDelay,
  withSpring,
} from "react-native-reanimated";

type FadeScaleUpConfig = WithSpringConfig & {
  delay?: number;
  initialTranslateY?: number;
  initialScale?: number;
};

export const fadeScaleUpSpringEnter = (userConfig: FadeScaleUpConfig = {}) => {
  "worklet";
  const {
    delay = 0,
    damping = 20,
    stiffness = 130,
    mass = 1,
    initialTranslateY = 7,
    initialScale = 0.95,
  } = userConfig;

  return () => {
    "worklet";
    return {
      initialValues: {
        transform: [{ translateY: initialTranslateY }, { scale: initialScale }],
        opacity: 0,
      },
      animations: {
        transform: [
          {
            translateY: withDelay(
              delay,
              withSpring(0, { damping, stiffness, mass })
            ),
          },
          {
            scale: withDelay(
              delay,
              withSpring(1, { damping, stiffness, mass })
            ),
          },
        ],
        opacity: withDelay(
          delay,
          withSpring(1, { damping, stiffness: stiffness - 20, mass })
        ),
      },
    };
  };
};
