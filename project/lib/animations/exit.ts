import {
  type WithSpringConfig,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const fadeScaleDownSpringExit = (userConfig = {}) => {
  "worklet";

  const {
    delay = 0,
    damping = 43,
    stiffness = 530,
    mass = 0.33,
  }: WithSpringConfig & { delay?: number } = userConfig;

  return () => {
    "worklet";
    return {
      initialValues: {
        transform: [{ translateY: 0 }, { scale: 1 }],
        opacity: 1,
      },
      animations: {
        transform: [
          {
            translateY: withDelay(
              delay,
              withSpring(2, { damping, stiffness, mass })
            ),
          },
          {
            scale: withDelay(
              delay,
              withSpring(0.985, { damping, stiffness, mass })
            ),
          },
        ],

        // Opacity must die fast — spring is too polite here
        opacity: withDelay(delay, withTiming(0, { duration: 40 })),
      },
    };
  };
};
