import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { THEME } from "@/lib/theme";
import { validateSnapIndex, validateSnapPoints } from "../utils";

/**
 * - `navigation`: Standard tab bar with navigation buttons
 * - `detached`: Modal displaying custom content
 */
export type TabMode = "navigation" | "detached";

/**
 * Visual configuration options for the tab bar.
 */
export type TabOptions = {
  backgroundColor: string;
  /** Distance in pixels from screen bottom (0 = attached, >0 = floating) */
  bottomSpacing: number;
  /** Tab bar width behavior ("default" = 350px max centered, "full" = screen width) */
  width: "default" | "full";
  /**
   * Called when the user touches outside the tab bar area.
   *
   * Only works when `mode` is set to `"detached"`. In this mode, interactions
   * with the underlying content are blocked, and this callback provides a way
   * to handle outside taps (for example, to dismiss or collapse the detached UI).
   */
  outsideTouchAction?: () => void;
  /**
   * Backdrop overlay color shown behind the tab bar when in `"detached"` mode.
   * - Only rendered when `mode === "detached"` **and**
   *   `outsideTouchAction` is provided.
   * - Blocks interaction with underlying content.
   * @default "transparent"
   */
  backdropColor: string;
  /**
   * Enable bottom sheet mode with gesture-driven snap points
   * When true, the detached content can be dragged between snap points.
   * @default false
   */
  enableBottomSheet?: boolean;
  /**
   * Content rendered below the scroll area, fixed at the bottom of the sheet.
   * Only used when `enableBottomSheet` is true.
   */
  footerContent?: () => React.ReactNode;
  /**
   * Array of snap points as percentages of screen height (0 - 1)
   * - Must have at least two snap points
   * - Will be auto-sorted ascending
   * @example [0.3, 0.6, 0.9] = 30%, 60%, 90% of screen height
   */
  snapPoints?: number[];
  /**
   * Initial snap point index to start at
   * Will be clamped to valid range [0, snapPoints.length - 1]
   * @default 0 (first/lowest snap point)
   */
  initialSnapIndex?: number;
};

/**
 * Represents a single entry in the content history stack
 */
type HistoryEntry = {
  content: () => React.ReactNode;
  options: TabOptions;
};

type TabState = {
  /**
   * Current tab bar mode
   * @default "navigation"
   */
  mode: TabMode;
  /**
   * Content renderer for detached mode (null hides content)
   */
  detachedContent: (() => React.ReactNode) | null;
  /**
   * Current tab bar behavior and styling options
   */
  options: TabOptions;
  /**
   * Previous options (preserved when switching modes)
   * used to restore state when going back to navigation
   */
  previousOptions: TabOptions;
  /**
   * History stack for detached content navigation
   * Allows push/pop operations for nested detached views
   */
  contentHistory: HistoryEntry[];
  /**
   * Current snap point index (when bottom sheet is enabled)
   * References position in options.snapPoints array
   * @default 0
   */
  currentSnapIndex: number;

  // ACTIONS

  /**
   * Switch tab bar mode with optional styling
   * @param mode - Target mode
   * @param options - Optional styling (merges with current, doesn't reset)
   */
  setMode: (mode: TabMode, options?: Partial<TabOptions>) => void;
  /**
   * Update only the options without changing mode
   * @param options - Partial options to merge with current
   */
  updateOptions: (options: Partial<TabOptions>) => void;
  /**
   * Set content to display in detached mode
   */
  setDetachedContent: (content: (() => React.ReactNode) | null) => void;
  /**
   * Show detached content with options in one call
   * Automatically switches to detached mode
   */
  showDetached: (
    content: () => React.ReactNode,
    options?: Partial<TabOptions>
  ) => void;
  /**
   * Dismiss detached mode and return to navigation
   * Restores previous options and clears history
   */
  dismissDetached: () => void;
  /**
   * Push new content onto the history stack
   * Current content is saved and new content is displayed
   * @param content - New content to display
   * @param options - Optional options for the new content
   */
  pushContent: (
    content: () => React.ReactNode,
    options?: Partial<TabOptions>
  ) => void;
  /**
   * Go back to previous content in history
   * If no history exists, dismisses detached mode
   * @returns true if went back in history, false if dismissed
   */
  goBack: () => boolean;
  /**
   * Check if there's history to go back to
   * @returns true if history exists, false otherwise
   */
  canGoBack: () => boolean;
  /**
   * Clear all history without dismissing
   * Useful when you want to reset the stack but stay in detached mode
   */
  clearHistory: () => void;
  /**
   * Navigate back to the first entry in the history stack, clearing everything in between.
   * If there is no history, does nothing.
   */
  popToRoot: () => void;
  /**
   * Programmatically snap to a specific snap point
   * Only works when bottom sheet is enabled via options
   * @param index - Index in options.snapPoints array
   * @returns true if successful, false if bottom sheet not enabled or invalid index
   */
  snapToIndex: (index: number) => boolean;
  /**
   * Snap to the maximum (highest) snap point
   */
  expandToMax: () => void;
  /**
   * Snap to the minimum (lowest) snap point
   */
  collapseToMin: () => void;
  /**
   * Get current snap point index
   * @returns Current index or -1 if bottom sheet not enabled
   */
  getCurrentSnapIndex: () => number;
  /**
   * Reset to initial state
   */
  reset: () => void;
};

// Default options for each mode
const DEFAULT_OPTIONS: TabOptions = {
  backgroundColor: THEME["surface-secondary"],
  bottomSpacing: 0,
  width: "full",
  backdropColor: "transparent",
};

const DETACHED_DEFAULT_OPTIONS: Partial<TabOptions> = {
  bottomSpacing: 27,
  width: "default",
  backdropColor: THEME.backdrop,
};

/**
 * Store for managing a dynamic tab bar that morphs between navigation,
 * bottom sheet, and floating modal states.
 *
 * - Mode switching between navigation and detached
 * - Option preservation across mode switches
 * - History stack for nested detached content
 * - Hardware back button support ready
 *
 * - Options are preserved between mode switches
 */
export const useTabStore = create<TabState>()((set, get) => ({
  mode: "navigation",
  detachedContent: null,
  options: DEFAULT_OPTIONS,
  previousOptions: DEFAULT_OPTIONS,
  contentHistory: [],
  currentSnapIndex: 0,

  setMode: (mode, options) => {
    const currentOptions = get().options;
    set({
      mode,
      options: {
        ...currentOptions,
        ...options,
      },
      previousOptions: currentOptions,
    });
  },

  updateOptions: (options) => {
    set((state) => ({
      options: {
        ...state.options,
        ...options,
      },
    }));
  },

  setDetachedContent: (content) => {
    set({ detachedContent: content });
  },

  showDetached: (content, options) => {
    const currentOptions = get().options;

    const validatedOptions = {
      ...currentOptions,
      ...DETACHED_DEFAULT_OPTIONS,
      ...options,
    };

    // Validate and normalize snap points if bottom sheet is enabled
    if (validatedOptions.enableBottomSheet && validatedOptions.snapPoints) {
      const validSnapPoints = validateSnapPoints(options?.snapPoints);

      if (validSnapPoints) {
        validatedOptions.snapPoints = validSnapPoints;
        const initialIndex = validateSnapIndex(
          options?.initialSnapIndex ?? 0,
          validSnapPoints
        );
        set({ currentSnapIndex: initialIndex });
      } else {
        // invalid snap points, disabled bottom sheet
        validatedOptions.enableBottomSheet = false;
        validatedOptions.snapPoints = undefined;
      }
    } else {
      // bottom sheet not enabled, reset snap index
      set({ currentSnapIndex: 0 });
    }

    set({
      mode: "detached",
      detachedContent: content,
      options: validatedOptions,
      previousOptions: currentOptions,
      // Clear history when showing new detached content from scratch
      contentHistory: [],
    });
  },

  dismissDetached: () => {
    const previousOptions = get().previousOptions;

    set({
      mode: "navigation",
      detachedContent: null,
      options: previousOptions,
      currentSnapIndex: 0,
      contentHistory: [],
    });
  },

  pushContent: (content, options) => {
    const state = get();

    // Save current content and options to history
    if (state.detachedContent) {
      const currentEntry: HistoryEntry = {
        content: state.detachedContent,
        options: state.options,
      };

      set({
        detachedContent: content,
        options: {
          ...state.options,
          ...options,
        },
        // Push current state onto history stack
        contentHistory: [...state.contentHistory, currentEntry],
      });
    } else {
      // If no current content, just show it
      get().showDetached(content, options);
    }
  },

  goBack: () => {
    const state = get();

    if (state.contentHistory.length === 0) {
      get().dismissDetached();
      return false;
    }

    const history = [...state.contentHistory];
    const previousEntry = history.pop();

    if (previousEntry) {
      set({
        detachedContent: previousEntry.content,
        options: previousEntry.options,
        contentHistory: history,
      });

      return true;
    }

    return false;
  },

  canGoBack: () => {
    return get().contentHistory.length > 0;
  },

  clearHistory: () => {
    set({ contentHistory: [] });
  },

  popToRoot: () => {
    const state = get();
    if (state.contentHistory.length === 0) {
      return;
    }

    const root = state.contentHistory[0];
    set({
      detachedContent: root.content,
      options: root.options,
      contentHistory: [],
    });
  },

  snapToIndex: (index) => {
    const state = get();

    if (!(state.options.enableBottomSheet && state.options.snapPoints)) {
      console.warn("Bottom sheet is not enabled");
      return false;
    }

    if (index < 0 || index >= state.options.snapPoints.length) {
      console.warn(
        `Invalid snap index: ${index}. Valid range: 0-${state.options.snapPoints.length - 1}`
      );
      return false;
    }

    set({ currentSnapIndex: index });
    return true;
  },

  expandToMax: () => {
    const state = get();
    if (state.options.snapPoints) {
      get().snapToIndex(state.options.snapPoints.length - 1);
    }
  },

  collapseToMin: () => {
    get().snapToIndex(0);
  },

  getCurrentSnapIndex: () => {
    const state = get();
    return state.options.enableBottomSheet ? state.currentSnapIndex : -1;
  },

  reset: () => {
    set({
      mode: "navigation",
      detachedContent: null,
      options: DEFAULT_OPTIONS,
      previousOptions: DEFAULT_OPTIONS,
      contentHistory: [],
      currentSnapIndex: 0,
    });
  },
}));

/**
 * Select only the mode
 */
export const useTabMode = () => useTabStore((s) => s.mode);

/**
 * Select only options with shallow equality check
 */
export const useTabOptions = () => useTabStore(useShallow((s) => s.options));

/**
 * Select only detached content
 */
export const useDetachedContent = () => useTabStore((s) => s.detachedContent);

/**
 * Select only actions
 */
export const useTabActions = () =>
  useTabStore(
    useShallow((s) => ({
      setMode: s.setMode,
      updateOptions: s.updateOptions,
      setDetachedContent: s.setDetachedContent,
      showDetached: s.showDetached,
      dismissDetached: s.dismissDetached,
      pushContent: s.pushContent,
      goBack: s.goBack,
      canGoBack: s.canGoBack,
      clearHistory: s.clearHistory,
      popToRoot: s.popToRoot,
      snapToIndex: s.snapToIndex,
      expandToMax: s.expandToMax,
      collapseToMin: s.collapseToMin,
      getCurrentSnapIndex: s.getCurrentSnapIndex,
      reset: s.reset,
    }))
  );

/**
 * Select history state
 */
export const useTabHistory = () => useTabStore((s) => s.contentHistory.length);

/**
 * Select bottom sheet state
 */
export const useBottomSheetState = () =>
  useTabStore(
    useShallow((s) => ({
      isEnabled: s.options.enableBottomSheet ?? false,
      snapPoints: s.options.snapPoints ?? null,
      currentSnapIndex: s.currentSnapIndex,
    }))
  );
