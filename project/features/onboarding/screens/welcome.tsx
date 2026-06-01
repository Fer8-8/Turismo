import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { LargeTitle } from "@/components/ui/large-title";
import { Text } from "@/components/ui/text";
import { LAYOUT, SPACING } from "@/lib/theme";
import { AnimatedSticker } from "../components/animated-sticker";

export function Welcome() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        LAYOUT.flex1,
        {
          paddingBottom: insets.bottom,
          paddingHorizontal: SPACING.lg,
        },
      ]}
    >
      <View style={LAYOUT.flex1}>
        <Image
          source={require("@/assets/images/states/puebla-state.png")}
          style={{
            width: 133,
            height: 177,
            position: "absolute",
            top: insets.top - SPACING["5xl"],
            left: SPACING["2xl"],
            transform: [{ rotate: "-28deg" }],
          }}
        />

        <AnimatedSticker
          imageStyle={{
            width: 108,
            height: 90,
          }}
          source={require("@/assets/stickers/sticker-pyramid.png")}
          style={{
            position: "absolute",
            top: insets.top - SPACING["2xl"],
            left: SPACING["2xl"],
          }}
        />

        <AnimatedSticker
          imageStyle={{
            width: 114,
            height: 107,
          }}
          rotation="-14deg"
          source={require("@/assets/stickers/sticker-doll.png")}
          style={{
            position: "absolute",
            bottom: -SPACING["5xl"],
            left: -SPACING["4xl"],
          }}
        />

        <AnimatedSticker
          delay={50}
          imageStyle={{
            height: 112,
            width: 210,
          }}
          initialTranslateY={120}
          rotation="10deg"
          source={require("@/assets/stickers/sticker-eagle.png")}
          style={{
            position: "absolute",
            bottom: -SPACING.sm,
            right: -SPACING["2xl"],
          }}
        />
      </View>

      <View style={{ zIndex: 1 }}>
        <Image
          source={require("@/assets/images/logos/logo-glass.png")}
          style={styles.appLogo}
        />
        <LargeTitle align="center" style={styles.title}>
          {t("onboarding.welcome.title")}
        </LargeTitle>
        <Text align="center" style={styles.description}>
          {t("onboarding.welcome.description")}
        </Text>

        <Image
          source={require("@/assets/images/states/yucatan-state.png")}
          style={{
            width: 112,
            height: 80,
            position: "absolute",
            bottom: 150,
            right: -SPACING["3xl"],
            transform: [{ rotate: "-13deg" }],
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Image
          source={require("@/assets/images/states/jalisco-state.png")}
          style={{
            width: 175,
            height: 171,
            position: "absolute",
            top: -80,
            left: -SPACING["4xl"],
            transform: [{ rotate: "-13deg" }],
          }}
        />

        <Image
          source={require("@/assets/images/states/guanajuato-state.png")}
          style={{
            width: 109,
            height: 95,
            position: "absolute",
            bottom: SPACING.xs,
            left: SPACING["5xl"],
            transform: [{ rotate: "-20deg" }],
          }}
        />

        <AnimatedSticker
          delay={100}
          imageStyle={{
            width: 186,
            height: 137,
          }}
          initialTranslateY={250}
          rotation="23deg"
          source={require("@/assets/stickers/sticker-butterfly.png")}
          style={{
            position: "absolute",
            bottom: SPACING.lg,
            left: -SPACING["3xl"],
          }}
        />

        <AnimatedSticker
          delay={180}
          imageStyle={{
            width: 113,
            height: 113,
          }}
          rotation="30deg"
          source={require("@/assets/stickers/sticker-logo.png")}
          style={{
            position: "absolute",
            top: -SPACING.xl,
            right: -SPACING["4xl"],
          }}
        />

        <AnimatedSticker
          imageStyle={{
            width: 90,
            height: 83,
          }}
          initialTranslateY={-50}
          source={require("@/assets/stickers/sticker-plant.png")}
          style={{
            position: "absolute",
            bottom: SPACING.xl,
            right: SPACING["5xl"],
            transform: [{ rotate: "-18deg" }],
          }}
        />
      </View>

      <View>
        <Image
          source={require("@/assets/images/states/quintana-roo-state.png")}
          style={{
            width: 104,
            height: 152,
            position: "absolute",
            top: -60,
            right: SPACING["3xl"],
            transform: [{ rotate: "38deg" }],
          }}
        />

        <View style={styles.actionsContainer}>
          <Button
            onPress={() => router.push("/preferences")}
            testID="startButton"
          >
            {t("onboarding.welcome.start")}
          </Button>
          <Button onPress={() => router.push("/sign-in")} variant="inverse">
            {t("onboarding.welcome.alreadyHaveAccount")}
          </Button>
        </View>
        <Text align="center" style={styles.legend} variant="caption">
          {t("onboarding.welcome.legend")}{" "}
          <Text color="foreground" variant="caption">
            {t("onboarding.welcome.termsOfUse")}
          </Text>{" "}
          {t("onboarding.welcome.and")}{" "}
          <Text color="foreground" variant="caption">
            {t("onboarding.welcome.privacyPolicy")}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appLogo: {
    width: 180,
    height: 180,
    marginHorizontal: "auto",
  },
  title: {
    marginTop: SPACING.lg,
  },
  description: {
    width: 300,
    marginHorizontal: "auto",
    marginTop: SPACING.sm,
  },
  actionsContainer: {
    gap: SPACING.xs,
  },
  legend: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
});
