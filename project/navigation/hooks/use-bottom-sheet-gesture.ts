import { Gesture } from "react-native-gesture-handler";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { SCROLL_TOP_THRESHOLD } from "../constants";
import { findClosestSnapPoint, snapToPoint } from "../utils";

type UseBottomSheetGestureParams = {
  enabled: boolean;
  snapPointsInPixels: number[] | null;
  currentSnapIndex: number;
  onSnapIndexChange: (index: number) => void;
  sheetPosition: SharedValue<number>;
  isGestureActive: SharedValue<boolean>;
  scrollY: SharedValue<number>;
  updateScrollEnabled: (enabled: boolean) => void;
};

/**
 * Handle bottom sheet pan gestures with scroll support
 */
export function useBottomSheetGesture({
  enabled,
  snapPointsInPixels,
  currentSnapIndex,
  onSnapIndexChange,
  sheetPosition,
  isGestureActive,
  scrollY,
  updateScrollEnabled,
}: UseBottomSheetGestureParams) {
  const context = useSharedValue(0);
  const gestureStartScrollY = useSharedValue(0);
  const isDraggingSheet = useSharedValue(false);

  /**
   * Simple pan gesture for the handle - always drags the sheet
   */
  const handlePanGesture = Gesture.Pan()
    .enabled(enabled && snapPointsInPixels !== null)
    .onBegin(() => {
      context.value = sheetPosition.value;
      isDraggingSheet.value = true;
      isGestureActive.value = true;
    })
    .onUpdate((event) => {
      if (!snapPointsInPixels || snapPointsInPixels.length === 0) {
        return;
      }

      const minSnap = snapPointsInPixels[0];
      const maxSnap = snapPointsInPixels.at(-1);

      if (maxSnap == null) {
        return;
      }

      // translationY positive = dragging DOWN = sheet goes down = height decreases
      const newHeight = context.value - event.translationY;

      // Apply overdrag — upper coefficient (4) for a subtler rubber band
      if (newHeight < minSnap) {
        const overDrag = minSnap - newHeight;
        sheetPosition.value = minSnap - Math.log(overDrag + 1) * 10;
      } else if (newHeight > maxSnap) {
        const overDrag = newHeight - maxSnap;
        sheetPosition.value = maxSnap + Math.log(overDrag + 1) * 4;
      } else {
        sheetPosition.value = newHeight;
      }
    })
    .onEnd((event) => {
      if (!snapPointsInPixels || snapPointsInPixels.length === 0) {
        isDraggingSheet.value = false;
        return;
      }

      isDraggingSheet.value = false;
      const velocity = -event.velocityY; // Invert to match height direction

      const closestIndex = findClosestSnapPoint(
        sheetPosition.value,
        velocity,
        snapPointsInPixels
      );

      snapToPoint(
        closestIndex,
        velocity,
        snapPointsInPixels,
        sheetPosition,
        isGestureActive,
        currentSnapIndex,
        onSnapIndexChange,
        updateScrollEnabled
      );
    })
    .onFinalize(() => {
      // Only reset isGestureActive here if the gesture was cancelled before
      // onEnd fired — if onEnd ran, snapToPoint owns the reset via spring callback.
      if (isDraggingSheet.value) {
        isGestureActive.value = false;
      }
      isDraggingSheet.value = false;
    });

  /**
   * Gesture for scrollable content area
   * Handles the interaction between scrolling and sheet dragging
   */
  const contentPanGesture = Gesture.Pan()
    .enabled(enabled && snapPointsInPixels !== null)
    .activeOffsetY([-10, 10])
    .onStart(() => {
      context.value = sheetPosition.value;
      gestureStartScrollY.value = scrollY.value;
      isDraggingSheet.value = false;
      isGestureActive.value = true;
    })
    .onUpdate((event) => {
      if (!snapPointsInPixels || snapPointsInPixels.length === 0) {
        return;
      }

      const minSnap = snapPointsInPixels[0];
      const maxSnap = snapPointsInPixels.at(-1) as number;

      // Read sheetPosition directly (shared value, always current on the UI
      // thread) instead of currentSnapIndex (stale JS closure) to avoid jitter
      // when the snap index hasn't synced yet.
      const isFullyExpanded = Math.abs(sheetPosition.value - maxSnap) < 10;

      // NOT FULLY EXPANDED - Always drag the sheet
      if (!isFullyExpanded) {
        isDraggingSheet.value = true;
        const newHeight = context.value - event.translationY;

        if (newHeight < minSnap) {
          sheetPosition.value =
            minSnap - Math.log(minSnap - newHeight + 1) * 10;
        } else if (newHeight > maxSnap) {
          sheetPosition.value = maxSnap + Math.log(newHeight - maxSnap + 1) * 4;
        } else {
          sheetPosition.value = newHeight;
        }
        return;
      }

      // FULLY EXPANDED - Check if we should drag or scroll.
      // 3px dead zone on isDraggingDown prevents finger micro-wobble from
      // flipping the condition before isDraggingSheet latches.
      const isAtTop = scrollY.value <= SCROLL_TOP_THRESHOLD;
      const isDraggingDown = event.translationY > 3;
      const wasAtTopAtStart = gestureStartScrollY.value <= SCROLL_TOP_THRESHOLD;

      const shouldDragSheet =
        isDraggingSheet.value || (isAtTop && isDraggingDown && wasAtTopAtStart);

      if (!shouldDragSheet) {
        // Let the scroll view handle this
        return;
      }

      // Drag the sheet
      isDraggingSheet.value = true;

      const newHeight = context.value - event.translationY;

      if (newHeight < minSnap) {
        sheetPosition.value = minSnap - Math.log(minSnap - newHeight + 1) * 10;
      } else if (newHeight > maxSnap) {
        sheetPosition.value = maxSnap + Math.log(newHeight - maxSnap + 1) * 4;
      } else {
        sheetPosition.value = newHeight;
      }
    })
    .onEnd((event) => {
      if (!snapPointsInPixels || snapPointsInPixels.length === 0) {
        isDraggingSheet.value = false;
        return;
      }

      if (isDraggingSheet.value) {
        const velocity = -event.velocityY;

        const closestIndex = findClosestSnapPoint(
          sheetPosition.value,
          velocity,
          snapPointsInPixels
        );

        snapToPoint(
          closestIndex,
          velocity,
          snapPointsInPixels,
          sheetPosition,
          isGestureActive,
          currentSnapIndex,
          onSnapIndexChange,
          updateScrollEnabled
        );
      }

      isDraggingSheet.value = false;
    })
    .onFinalize(() => {
      if (!isDraggingSheet.value) {
        isGestureActive.value = false;
      }
      isDraggingSheet.value = false;
    });

  const scrollViewGesture = Gesture.Native();
  const simultaneousGesture = Gesture.Simultaneous(
    scrollViewGesture,
    contentPanGesture
  );

  return {
    handleGesture: handlePanGesture,
    contentGesture: simultaneousGesture,
  };
}
