import { StyleSheet, View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ScrollContainer } from "@/components/scroll-container";
import { Text } from "@/components/ui/text";
import { ChangeLanguage } from "@/features/settings/components/change-language";
import { LAYOUT, SPACING } from "@/lib/theme";
import { DeleteLinkedData } from "../components/delete-linked-data";

export function SettingsOptionsScreen() {
  return (
    <View style={LAYOUT.flex1}>
      <FixedHeaderLayout>
        <ScreenHeader titleKey="options.settings.title" />
      </FixedHeaderLayout>
      <ScrollContainer>
        <Text color="muted" style={styles.title}>
          Preferencias
        </Text>
        <ChangeLanguage />
        <Text color="muted" style={[styles.title, styles.section]}>
          Privacidad
        </Text>
        <DeleteLinkedData />
      </ScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: SPACING.sm,
  },
  section: {
    marginTop: SPACING.lg,
  },
});
