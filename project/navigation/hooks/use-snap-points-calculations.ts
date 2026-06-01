import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCREEN_HEIGHT } from "@/lib/constants";

/**
 * Calculate snap point positions in pixels
 *
 * Converts snap point percentages (0-1) to actual pixel positions
 * based on available screen height minus safe areas
 *
 * @param snapPoints - Array of snap points as percentages (0-1)
 * @param enabled - Whether bottom sheet is enabled
 * @returns Calculated snap points and helper functions
 *
 * @example
 * const { snapPointsInPixels, findNearestSnapIndex } = useSnapPointCalculations(
 *   [0.3, 0.6, 0.9],
 *   true
 * );
 * // Result: [240, 480, 720] for 800px screen height
 */
export function useSnapPointCalculations(
  snapPoints: number[] | undefined,
  enabled = false
) {
  const insets = useSafeAreaInsets();

  const availableHeight = useMemo(() => {
    // Ignore bottom inset, because the bottom sheet sits flush at the screen bottom
    return SCREEN_HEIGHT - insets.top;
  }, [insets.top]);

  const snapPointsInPixels = useMemo(() => {
    if (!(enabled && snapPoints) || snapPoints.length === 0) {
      return null;
    }

    // Convert each percentage to pixels
    return snapPoints.map((point) => availableHeight * point);
  }, [enabled, snapPoints, availableHeight]);

  return {
    snapPointsInPixels,
    availableHeight,
    minSnapPoint: snapPointsInPixels?.[0] ?? 0,
    maxSnapPoint: snapPointsInPixels?.[snapPointsInPixels.length - 1] ?? 0,
  };
}
