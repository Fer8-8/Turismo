import Octicons from "@expo/vector-icons/Octicons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { BLUE, RADIUS, SPACING } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";
import { useSettingsStore } from "@/store/settings-store";
import { LanguageSelector } from "./language-selector";

export function ChangeLanguage() {
  const { t } = useTranslation();
  const { showDetached, dismissDetached } = useTabActions();
  const appLanguage = useSettingsStore((s) => s.appLanguage);

  function handleShowLanguagePicker() {
    showDetached(() => <LanguageSelector />, {
      outsideTouchAction: dismissDetached,
    });
  }

  return (
    <Pressable
      onPress={handleShowLanguagePicker}
      testID="settings-change-language"
    >
      <Card style={styles.item}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Octicons color={"#fff"} name={"globe"} size={16} />
          </View>
          <Text color="title">
            {t("options.settings.actions.changeLanguage")}
          </Text>
        </View>

        <Text>{appLanguage?.toUpperCase()}</Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: SPACING.lg,
    padding: SPACING.sm,
  },
  iconContainer: {
    backgroundColor: BLUE[500],
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
});
