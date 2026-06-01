import type { WithSpringConfig } from "react-native-reanimated";

export const DETACHED_TABBAR_SPRING_CONFIG: WithSpringConfig = {
  damping: 25,
  stiffness: 260,
  mass: 1,
};

export const BOTTOM_SHEET_SPRING_CONFIG: WithSpringConfig = {
  damping: 42,
  stiffness: 280,
  mass: 1,
};
