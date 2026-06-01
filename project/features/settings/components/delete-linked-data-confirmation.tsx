import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { usePreferencesStore } from "@/features/onboarding/store/preferences-store";
import { authClient } from "@/lib/auth-client";
import { RADIUS, RED, SPACING } from "@/lib/theme";
import { AnimatedModalContent } from "@/navigation/components/animated-modal-content";
import { DetachedModalHeader } from "@/navigation/components/detached-modal-header";
import { useTabActions } from "@/navigation/store/tab-store";

export function DeleteLinkedDataConfirmation() {
  const { t } = useTranslation();
  const { data: session } = authClient.useSession();

  const { dismissDetached } = useTabActions();
  const resetOnboarding = usePreferencesStore((s) => s.resetOnboarding);

  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteAnonymousAccount() {
    try {
      setIsLoading(true);
      const { data } = await authClient.deleteAnonymousUser();
      if (data?.success) {
        await authClient.signOut();
        resetOnboarding();
        dismissDetached();
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      setIsLoading(true);
      const { data } = await authClient.deleteUser();
      if (data?.success) {
        await authClient.signOut();
        resetOnboarding();
        dismissDetached();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View>
      <AnimatedModalContent>
        <DetachedModalHeader disableCloseButton={isLoading} title="" />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Octicons color={RED[500]} name="alert" size={48} />
          </View>

          <Text align="center" style={styles.title} variant="subtitle">
            {t("options.settings.deleteConfirmation.title")}
          </Text>

          <Text align="center">
            {session?.user?.isAnonymous
              ? t("options.settings.deleteConfirmation.descriptionData")
              : t(
                  "options.settings.deleteConfirmation.descriptionAccount"
                )}{" "}
            <Text color="title">
              {t("options.settings.deleteConfirmation.irreversible")}
            </Text>
          </Text>
        </View>
        <View style={styles.footer}>
          <Button
            disabled={isLoading}
            onPress={dismissDetached}
            style={styles.footerAction}
            variant="secondary"
          >
            {t("options.settings.deleteConfirmation.cancel")}
          </Button>
          <Button
            onPress={
              session?.user?.isAnonymous
                ? handleDeleteAnonymousAccount
                : handleDeleteAccount
            }
            style={styles.footerAction}
            testID="settings-confirm-delete-account"
            variant="danger"
          >
            {isLoading ? (
              <ActivityIndicator color={"#ffffff"} size="small" />
            ) : (
              t("options.settings.deleteConfirmation.confirm")
            )}
          </Button>
        </View>
      </AnimatedModalContent>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: -SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  iconContainer: {
    borderRadius: RADIUS.full,
    padding: SPACING.xl,
    backgroundColor: `${RED[500]}10`,
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  footer: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
    paddingTop: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  footerAction: {
    flex: 1,
  },
});
