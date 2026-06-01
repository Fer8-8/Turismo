import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import { useTabActions, useTabMode } from "@/navigation/store/tab-store";

/**
 * Hook to handle Android hardware back button for tab bar navigation
 *
 * - If in detached mode with history: Go back in history
 * - If in detached mode without history: Dismiss detached mode
 * - If in navigation mode: Allow default behavior (exit app)
 *
 * Usage:
 * Add this hook in your CustomTab component or root app component
 *
 * @example
 * ```tsx
 * function CustomTab(props: BottomTabBarProps) {
 *   useTabBarBackHandler();
 *   // ... rest of component
 * }
 * ```
 */
export function useTabBarBackHandler() {
  const mode = useTabMode();
  const { goBack } = useTabActions();

  useEffect(() => {
    // Only handle back button on Android when in detached mode
    if (Platform.OS !== "android" || mode !== "detached") {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // goBack() returns true if it went back in history,
        // false if it dismissed (no history)
        goBack();

        // Return true to prevent default behavior (exit app)
        return true;
      }
    );

    // Cleanup subscription on unmount or when mode changes
    return () => backHandler.remove();
  }, [mode, goBack]);
}

/**
 * Advanced version with custom callback support
 *
 * @param onBackPress - Optional callback before default back behavior
 * @returns Object with methods to control back behavior
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
 *
 *   useTabBarBackHandler({
 *     onBackPress: () => {
 *       if (hasUnsavedChanges) {
 *         Alert.alert(
 *           "Unsaved Changes",
 *           "Are you sure you want to go back?",
 *           [
 *             { text: "Cancel", style: "cancel" },
 *             { text: "Discard", onPress: () => goBack() },
 *           ]
 *         );
 *         return true; // Prevent default back
 *       }
 *       return false; // Allow default back
 *     },
 *   });
 * }
 * ```
 */
export function useTabBarBackHandlerAdvanced(options?: {
  onBackPress?: () => boolean;
}) {
  const mode = useTabMode();
  const { goBack, canGoBack } = useTabActions();

  useEffect(() => {
    if (Platform.OS !== "android" || mode !== "detached") {
      return;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Call custom callback first
        if (options?.onBackPress) {
          const shouldPrevent = options.onBackPress();
          // If callback returns true, prevent default behavior
          if (shouldPrevent === true) {
            return true;
          }
        }

        // Default behavior: go back in history or dismiss
        goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [mode, goBack, options]);

  return {
    canGoBack,
    goBack,
  };
}
