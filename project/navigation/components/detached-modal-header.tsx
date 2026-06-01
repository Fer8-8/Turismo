import Octicons from "@expo/vector-icons/Octicons";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { haptics } from "@/lib/haptics";
import { SPACING, THEME } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";

type DetachedModalHeaderProps = {
  title: string;
  showCloseButton?: boolean;
  disableCloseButton?: boolean;
};

export function DetachedModalHeader({
  title,
  showCloseButton = true,
  disableCloseButton = false,
}: DetachedModalHeaderProps) {
  const { canGoBack, goBack, dismissDetached } = useTabActions();
  const isBackButtonVisible = canGoBack();

  function handleDismiss() {
    haptics.tap();
    dismissDetached();
  }

  function handleGoBack() {
    if (isBackButtonVisible) {
      haptics.tap();
      goBack();
    }
  }

  return (
    <View style={styles.header}>
      <View
        style={[
          styles.titleContainer,
          // {
          //   paddingLeft: isBackButtonVisible ? 0 : SPACING.sm,
          // },
        ]}
      >
        {isBackButtonVisible ? (
          <Button
            aria-label="Go back"
            hitSlop={8}
            onPress={handleGoBack}
            style={styles.backButton}
          >
            <Octicons color={THEME.foreground} name="chevron-left" size={22} />
          </Button>
        ) : null}

        <Text numberOfLines={1} variant="subtitle">
          {title}
        </Text>
      </View>

      {showCloseButton && (
        <Button
          aria-label="Close modal"
          disabled={disableCloseButton}
          hitSlop={8}
          onPress={handleDismiss}
          style={styles.closeButton}
          testID="detached-modal-header-close"
        >
          <Octicons color={THEME.foreground} name="x" size={22} />
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 24,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 24,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.surface,
    paddingHorizontal: 0,
  },
});
