import { type SharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { BOTTOM_SHEET_SPRING_CONFIG } from "@/lib/animations/config/spring";
import { VELOCITY_THRESHOLD } from "./constants";

/**
 * Helper function to validate and normalize snap points
 * Validate all the snap points are between 0 and 1, and return them
 * sorted in ascending order
 *
 * @param snapPoints - Array of snap points
 * @returns Validated and normalized snap points or null if invalid
 */
export function validateSnapPoints(snapPoints?: number[]): number[] | null {
  if (!(snapPoints && Array.isArray(snapPoints))) {
    return null;
  }

  if (snapPoints.length < 2) {
    console.warn("Bottom sheet requires at least 2 snap points");
    return null;
  }

  // all points should be between 0 and 1
  const invalidPoints = snapPoints.filter((p) => p < 0 || p > 1);
  if (invalidPoints.length > 0) {
    console.warn("Snap points must be between 0 and 1 (percentages)");
    return null;
  }

  return [...snapPoints].sort((a, b) => a - b);
}

/**
 * Clamp the index so it never goes out of bounds
 *
 * @param index - Index to clamp
 * @param snapPoints - Array of snap points
 * @returns Clamped index
 */
export function validateSnapIndex(
  index: number,
  snapPoints: number[] | null | undefined
): number {
  if (!snapPoints || snapPoints.length === 0) {
    return 0;
  }
  return Math.max(0, Math.min(index, snapPoints.length - 1));
}

/**
 * Find the closest snap point based on current position and velocity
 */
export function findClosestSnapPoint(
  currentHeight: number,
  velocity: number,
  snapPoints: number[]
): number {
  "worklet";

  // Fast flick - go to next/prev snap point
  if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
    const direction = velocity > 0 ? 1 : -1;

    // Find current position in snap points
    let currentIndex = 0;
    let minDistance = Math.abs(currentHeight - snapPoints[0]);

    for (let i = 1; i < snapPoints.length; i++) {
      const distance = Math.abs(currentHeight - snapPoints[i]);
      if (distance < minDistance) {
        minDistance = distance;
        currentIndex = i;
      }
    }

    const nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < snapPoints.length) {
      return nextIndex;
    }
  }

  // Slow drag - snap to nearest
  let closestIndex = 0;
  let minDistance = Math.abs(currentHeight - snapPoints[0]);

  for (let i = 1; i < snapPoints.length; i++) {
    const distance = Math.abs(currentHeight - snapPoints[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}

/**
 * Snap to a specific snap point
 */
export function snapToPoint(
  targetIndex: number,
  velocity: number,
  snapPoints: number[],
  sheetPosition: SharedValue<number>,
  isGestureActive: SharedValue<boolean>,
  currentSnapIndex: number,
  onSnapIndexChange: (index: number) => void,
  updateScrollEnabled: (enabled: boolean) => void
) {
  "worklet";

  if (targetIndex < 0 || targetIndex >= snapPoints.length) {
    return;
  }

  const maxSnapIndex = snapPoints.length - 1;
  const shouldEnableScroll = targetIndex === maxSnapIndex;

  sheetPosition.value = withSpring(
    snapPoints[targetIndex],
    {
      ...BOTTOM_SHEET_SPRING_CONFIG,
      velocity,
    },
    (finished) => {
      if (finished) {
        isGestureActive.value = false;
      }
    }
  );

  // Update scroll enabled state
  scheduleOnRN(updateScrollEnabled, shouldEnableScroll);

  // Notify index change
  if (targetIndex !== currentSnapIndex) {
    scheduleOnRN(onSnapIndexChange, targetIndex);
  }
}
