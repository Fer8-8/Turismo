import { StyleSheet } from "react-native";

export const THEME = {
  surface: "#F5F5F5",
  "surface-secondary": "#FFFFFF",

  foreground: "#595959",
  "foreground-title": "#000000",
  "foreground-muted": "#8A8A8A",

  "active-tab": "#000000",
  "inactive-tab": "#A0A7AB",

  backdrop: "#00000050",

  primary: "#000000",
  "primary-foreground": "#FFFFFF",
  "primary-inverse": "#FFFFFF",
  "primary-inverse-foreground": "#595959",

  selected: "#3B82F6",
  "selected-overlay": "#3B82F615",
} as const;

export const RED = {
  500: "#ef4444",
} as const;

export const BLUE = {
  500: "#3b82f6",
} as const;

export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const;

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const SIZE = {
  button: 54,
} as const;

export const FONT = {
  family: "ui-rounded", // this uses the SF Pro Rounded system font in ios
  display: 32,
  title: 28,
  subtitle: 20,
  body: 16,
  "body-small": 14,
  caption: 12,
} as const;

export const LAYOUT = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
});

export const ABSOLUTE_CUSTOM_HEADER_HEIGHT = 140;
export const NAVIGATION_HEIGTH = 88;
export const HEADER_HEIGHT = 48;
