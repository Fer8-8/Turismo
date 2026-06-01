import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

const SIZE = 25;
const COLS = 6;
const ROWS = 5;

const BASE_COLOR = "#F54900";
const OPACITIES = [0.05, 0.1, 0.15, 0.2];

// biome-ignore format: keep this pattern layout
const PATTERN = [
  0, 0, 1, 0, 0, 0,
  0, 0, 0, 1, 1, 0,
  0, 1, 0, 1, 0, 1,
  1, 0, 1, 0, 1, 0,
  1, 1, 0, 1, 1, 1,
] as const;

export function LiveEventBannerPattern() {
  const opacities = useMemo(() => {
    return PATTERN.map((cell) => {
      if (!cell) {
        return null;
      }
      return OPACITIES[Math.floor(Math.random() * OPACITIES.length)];
    });
  }, []);

  return (
    <View pointerEvents="none" style={styles.container}>
      {PATTERN.map((cell, index) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: just decoration pattern
          key={index}
          style={[
            styles.square,
            cell === 0 ? styles.empty : null,
            cell ? { opacity: opacities[index] ?? 1 } : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: SIZE * COLS,
    height: SIZE * ROWS,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: BASE_COLOR,
  },
  empty: {
    backgroundColor: "transparent",
  },
});
