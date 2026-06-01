import Octicons from "@expo/vector-icons/Octicons";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";
import { AnimatedModalContent } from "@/navigation/components/animated-modal-content";
import { DetachedModalHeader } from "@/navigation/components/detached-modal-header";
import { type AppLanguage, useSettingsStore } from "@/store/settings-store";

const LANGUAGE_OPTIONS: AppLanguage[] = ["es", "en", "fr"];

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const appLanguage = useSettingsStore((s) => s.appLanguage);
  const setAppLanguage = useSettingsStore((s) => s.setAppLanguage);

  function changeLanguage(language: AppLanguage) {
    i18n.changeLanguage(language);
    setAppLanguage(language);
  }

  return (
    <View>
      <AnimatedModalContent>
        <DetachedModalHeader title={t("options.settings.language.title")} />

        <View style={styles.container}>
          <View style={styles.content}>
            {LANGUAGE_OPTIONS.map((id) => (
              <Button
                key={id}
                onPress={() => changeLanguage(id)}
                style={[styles.item, appLanguage === id && styles.selectedItem]}
                testID={`language-selector-${id}`}
              >
                <Text
                  style={appLanguage === id ? styles.selectedText : undefined}
                >
                  {t(`options.settings.language.options.${id}`)}
                </Text>

                {appLanguage === id && (
                  <Octicons
                    color={THEME.selected}
                    name="check-circle"
                    size={18}
                  />
                )}
              </Button>
            ))}
          </View>
        </View>
      </AnimatedModalContent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  content: {
    gap: SPACING.xs,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 48,
    borderRadius: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: THEME.surface,
  },
  selectedItem: {
    backgroundColor: THEME["selected-overlay"],
  },
  selectedText: {
    color: THEME.selected,
  },
});
