import { Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { SPACING, THEME } from "@/lib/theme";

export function PlaceDetailsHeader() {
  const router = useRouter();

  function handleGoBack() {
    if (router.canGoBack()) {
      router.back();
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Button
        hitSlop={8}
        onPress={handleGoBack}
        style={styles.iconButton}
        variant="inverse"
      >
        <BlurView style={StyleSheet.absoluteFillObject} />
        <Octicons
          color={THEME["foreground-title"]}
          name="chevron-left"
          size={24}
        />
      </Button>

      {/*<View style={styles.leftActions}>
        <Button hitSlop={8} style={styles.iconButton} variant="inverse">
          <BlurView style={StyleSheet.absoluteFillObject} />
          <Octicons
            color={THEME["foreground-title"]}
            name="share-android"
            size={18}
          />
        </Button>

        <Button hitSlop={8} style={styles.iconButton} variant="inverse">
          <BlurView style={StyleSheet.absoluteFillObject} />
          <Octicons color={THEME["foreground-title"]} name="heart" size={18} />
        </Button>
      </View>*/}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 38,
    borderCurve: "continuous",
    paddingHorizontal: 0,
    backgroundColor: `${THEME["primary-inverse"]}95`,
    overflow: "hidden",
  },
});
