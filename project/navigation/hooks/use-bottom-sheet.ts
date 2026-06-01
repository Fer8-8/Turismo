import {
  useBottomSheetState,
  useTabActions,
} from "@/navigation/store/tab-store";

/**
 * Convenience hook for controlling bottom sheet from content components
 *
 * Provides a clean API for common bottom sheet operations without
 * needing to interact with the store directly
 *
 * @returns Bottom sheet controls and state
 *
 * @example
 * function MySheetContent() {
 *   const sheet = useBottomSheet();
 *
 *   return (
 *     <View>
 *       <Text>Current snap: {sheet.currentIndex}</Text>
 *       <Button onPress={sheet.expand}>Expand</Button>
 *       <Button onPress={sheet.collapse}>Collapse</Button>
 *     </View>
 *   );
 * }
 */
export function useBottomSheet() {
  const { snapToIndex, expandToMax, collapseToMin } = useTabActions();
  const { isEnabled, snapPoints, currentSnapIndex } = useBottomSheetState();

  return {
    // === STATE ===

    /** Whether bottom sheet is currently enabled */
    isEnabled,

    /** Current snap point index */
    currentIndex: currentSnapIndex,

    /** Array of snap points (percentages) */
    snapPoints,

    /** Whether at maximum snap point */
    isExpanded:
      isEnabled && snapPoints
        ? currentSnapIndex === snapPoints.length - 1
        : false,

    /** Whether at minimum snap point */
    isCollapsed: isEnabled ? currentSnapIndex === 0 : false,

    /** Whether at a middle snap point */
    isPartial:
      isEnabled && snapPoints
        ? currentSnapIndex > 0 && currentSnapIndex < snapPoints.length - 1
        : false,

    // === ACTIONS ===

    /**
     * Snap to specific index
     * @param index - Target snap point index
     */
    snapToIndex,

    /** Expand to maximum snap point */
    expand: expandToMax,

    /** Collapse to minimum snap point */
    collapse: collapseToMin,

    /**
     * Go to next snap point (if not at max)
     * @returns true if moved, false if already at max
     */
    next: () => {
      if (
        !(isEnabled && snapPoints) ||
        currentSnapIndex >= snapPoints.length - 1
      ) {
        return false;
      }
      return snapToIndex(currentSnapIndex + 1);
    },

    /**
     * Go to previous snap point (if not at min)
     * @returns true if moved, false if already at min
     */
    previous: () => {
      if (!isEnabled || currentSnapIndex <= 0) {
        return false;
      }
      return snapToIndex(currentSnapIndex - 1);
    },
  };
}
