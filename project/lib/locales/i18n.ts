import { getLocales } from "expo-localization";
// biome-ignore lint/style/noExportedImports: i18next default export intentionally used
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { type AppLanguage, useSettingsStore } from "@/store/settings-store";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";

/**
 * Detects the user's preferred language from device settings.
 * Iterates through the device's language preferences in order and returns
 * the first language that matches our supported languages.
 *
 * @returns The first supported language from device preferences, or "en" as fallback
 */
function getDeviceLanguage(): AppLanguage {
  const deviceLocales = getLocales();

  for (const locale of deviceLocales) {
    if (locale.languageCode === "en") {
      return "en";
    }
    if (locale.languageCode === "fr") {
      return "fr";
    }
    if (locale.languageCode === "es") {
      return "es";
    }
  }

  return "en";
}

/**
 * Determines the initial language for the app.
 * Priority:
 * 1. User's manually selected language (saved in store)
 * 2. Device's detected language (auto-detected on first launch)
 *
 * On first app launch (when no language is saved), this function will:
 * - Detect the device language
 * - Save it to the store for future reference
 * - Return it for i18n initialization
 *
 * @returns The language code to use for app initialization
 */
function getInitialLanguage() {
  const savedLanguage = useSettingsStore.getState().appLanguage;

  if (!savedLanguage) {
    const deviceLanguage = getDeviceLanguage();
    useSettingsStore.setState({ appLanguage: deviceLanguage });
    return deviceLanguage;
  }

  return savedLanguage;
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
    },
    fallbackLng: "en",
    lng: getInitialLanguage(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
