import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Supported languages in the application.
 */
export type AppLanguage = "en" | "es" | "fr";

type SettingsStoreState = {
  /**
   * The user's saved language preference.
   *
   * - `null`: User has not manually selected a language yet.
   *   The app will auto-detect from device settings and save it on first launch.
   *
   * - `AppLanguage`: User has explicitly chosen this language (either manually or auto-detected on first launch).
   *
   * Note: This store only persists the preference.
   * The actual language switching logic is handled in the UI using i18n.changeLanguage().
   */
  appLanguage: AppLanguage | null;
  /**
   * Saves the user's language preference to persistent storage.
   *
   * Important: This does NOT change the active language in the app.
   * To change the language, use i18n.changeLanguage() in your UI components,
   * then call this function to persist the choice.
   *
   * @param language - The language code to save, or null to reset
   */
  setAppLanguage: (language: AppLanguage | null) => void;
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      appLanguage: null,
      setAppLanguage: (language) => set({ appLanguage: language }),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
