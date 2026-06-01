import Octicons from "@expo/vector-icons/Octicons";
import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { LAYOUT, RADIUS, SPACING, THEME } from "@/lib/theme";
import { type AppLanguage, useSettingsStore } from "@/store/settings-store";

type LanguageSelectorProps = {
  onNext?: () => void;
};

export function LanguageSelector({ onNext }: LanguageSelectorProps) {
  const { t } = useTranslation();
  const selectedLang = useSettingsStore((s) => s.appLanguage);
  const setSelectedLang = useSettingsStore((s) => s.setAppLanguage);

  function selectLanguage(lang: AppLanguage) {
    setSelectedLang(lang);
    changeLanguage(lang);
  }

  return (
    <View style={LAYOUT.flex1}>
      <View style={LAYOUT.flex1}>
        <Text variant="title">{t("options.settings.language.title")}</Text>
        <Text style={styles.subtitle}>
          {t("options.settings.language.subtitle")}
        </Text>
        <View style={styles.content}>
          <Button
            onPress={() => selectLanguage("es")}
            style={[
              styles.languageButton,
              selectedLang === "es" && styles.selected,
            ]}
            testID="esButton"
          >
            <View style={styles.labelContainer}>
              <Image
                source={require("@/assets/images/flags/es.png")}
                style={styles.image}
              />
              <Text>{t("options.settings.language.options.es")}</Text>
            </View>
            {selectedLang === "es" && (
              <Octicons
                color={THEME.selected}
                name="check-circle"
                size={18}
                style={{ marginLeft: "auto" }}
              />
            )}
          </Button>

          <Button
            onPress={() => selectLanguage("en")}
            style={[
              styles.languageButton,
              selectedLang === "en" && styles.selected,
            ]}
          >
            <View style={styles.labelContainer}>
              <Image
                source={require("@/assets/images/flags/en.png")}
                style={styles.image}
              />
              <Text>{t("options.settings.language.options.en")}</Text>
            </View>
            {selectedLang === "en" && (
              <Octicons
                color={THEME.selected}
                name="check-circle"
                size={18}
                style={{ marginLeft: "auto" }}
              />
            )}
          </Button>

          <Button
            onPress={() => selectLanguage("fr")}
            style={[
              styles.languageButton,
              selectedLang === "fr" && styles.selected,
            ]}
          >
            <View style={styles.labelContainer}>
              <Image
                source={require("@/assets/images/flags/fr.png")}
                style={styles.image}
              />
              <Text>{t("options.settings.language.options.fr")}</Text>
            </View>
            {selectedLang === "fr" && (
              <Octicons
                color={THEME.selected}
                name="check-circle"
                size={18}
                style={{ marginLeft: "auto" }}
              />
            )}
          </Button>
        </View>
      </View>

      <Button disabled={!selectedLang} onPress={onNext} testID="nextButton">
        {t("common.next")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  subtitle: {
    marginTop: SPACING.xs,
  },
  languageButton: {
    borderRadius: RADIUS.lg,
    borderCurve: "continuous",
    backgroundColor: THEME["surface-secondary"],
    flexDirection: "row",
    gap: SPACING.md,
    justifyContent: "flex-start",
    paddingHorizontal: SPACING.sm,
  },
  labelContainer: {
    flexDirection: "row",
    gap: SPACING.xs,
  },
  selected: {
    borderWidth: 1,
    borderColor: THEME.selected,
    backgroundColor: THEME["selected-overlay"],
  },
  image: {
    width: 32,
    height: 22,
    resizeMode: "contain",
  },
});
