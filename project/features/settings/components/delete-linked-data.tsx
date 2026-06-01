import { Octicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";
import { RADIUS, RED, SPACING } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";
import { DeleteLinkedDataConfirmation } from "./delete-linked-data-confirmation";

export function DeleteLinkedData() {
  const { t } = useTranslation();
  const { data: session } = authClient.useSession();
  const { showDetached, dismissDetached } = useTabActions();

  function handleShowDeleteConfirmation() {
    showDetached(() => <DeleteLinkedDataConfirmation />, {
      outsideTouchAction: dismissDetached,
    });
  }

  return (
    <Pressable
      onPress={handleShowDeleteConfirmation}
      testID="settings-delete-account"
    >
      <Card style={styles.item}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Octicons color={"#fff"} name={"trash"} size={16} />
          </View>
          <Text style={styles.label}>
            {session?.user?.isAnonymous
              ? t("options.settings.actions.deleteData")
              : t("options.settings.actions.deleteAccount")}
          </Text>
        </View>

        <Octicons color={`${RED[500]}90`} name={"chevron-right"} size={18} />
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
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  iconContainer: {
    backgroundColor: RED[500],
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: RED[500],
  },
});
