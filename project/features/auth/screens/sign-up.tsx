import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FadeView } from "@/components/animations/fade-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { usePreferencesStore } from "@/features/onboarding/store/preferences-store";
import { authClient } from "@/lib/auth-client";
import { LAYOUT, SPACING, THEME } from "@/lib/theme";

type SignUpProps = {
  continueWithoutAccount?: boolean;
};

export function SignUp({ continueWithoutAccount = true }: SignUpProps) {
  const { t } = useTranslation();
  const completeOnboarding = usePreferencesStore((s) => s.completeOnboarding);
  const [loading, setLoading] = useState(false);

  async function signUpAnonymous() {
    setLoading(true);
    const { error } = await authClient.signIn.anonymous();
    if (!error) {
      completeOnboarding();
    }
    setLoading(false);
  }

  return (
    <View style={LAYOUT.flex1}>
      <View style={LAYOUT.flex1}>
        <FadeView delay={20} enableBlur={false} style={{ zIndex: 1 }}>
          <Text variant="title">{t("onboarding.signUp.title")}</Text>
          <Text style={styles.subtitle}>{t("onboarding.signUp.subtitle")}</Text>
        </FadeView>

        <View style={[LAYOUT.flex1, LAYOUT.center]}>
          <FadeView
            delay={100}
            style={{
              position: "absolute",
              top: -SPACING["2xl"],
              left: -SPACING.xl,
            }}
          >
            <Image
              source={require("@/assets/images/states/sonora-state.png")}
              style={{
                width: 146,
                height: 160,
              }}
            />
          </FadeView>

          <FadeView
            delay={150}
            style={{
              position: "absolute",
              top: SPACING.xl,
              left: SPACING.lg,
              transform: [{ rotate: "-10deg" }],
            }}
          >
            <Image
              source={require("@/assets/stickers/sticker-face.png")}
              style={{
                width: 76,
                height: 86,
              }}
            />
          </FadeView>

          <FadeView
            delay={200}
            style={{
              position: "absolute",
              bottom: SPACING["2xl"],
              left: SPACING.xl,
              transform: [{ rotate: "40deg" }],
            }}
          >
            <Image
              source={require("@/assets/images/states/nuevo-leon-state.png")}
              style={{
                width: 97,
                height: 179,
              }}
            />
          </FadeView>

          <FadeView
            delay={250}
            style={{
              position: "absolute",
              top: SPACING.xl,
              right: SPACING.sm,
            }}
          >
            <Image
              source={require("@/assets/images/states/zacatecas-state.png")}
              style={{
                width: 138,
                height: 177,
              }}
            />
          </FadeView>

          <FadeView
            delay={300}
            style={{
              position: "absolute",
              bottom: SPACING.xl,
              right: -SPACING.xl,
              transform: [{ rotate: "15deg" }],
            }}
          >
            <Image
              source={require("@/assets/images/states/tabasco-state.png")}
              style={{
                width: 192,
                height: 89,
              }}
            />
          </FadeView>

          <FadeView delay={400}>
            <Image
              source={require("@/assets/stickers/sticker-wheel-fortune.png")}
              style={{
                width: 195,
                height: 188,
              }}
            />
          </FadeView>

          <FadeView
            delay={350}
            style={{
              position: "absolute",
              top: SPACING["2xl"],
              right: SPACING.lg,
              transform: [{ rotate: "15deg" }],
            }}
          >
            <Image
              source={require("@/assets/stickers/sticker-bridge.png")}
              style={{
                width: 89,
                height: 75,
              }}
            />
          </FadeView>
        </View>
      </View>

      <View>
        <View style={styles.buttonsContainer}>
          <FadeView delay={500} enableBlur={false} translateYRange={[20, 0]}>
            <Button>
              <Text color="inverse" fontWeight="600">
                {t("onboarding.signUp.continueWithApple")}
              </Text>
              <Image
                source={require("@/assets/images/logos/apple-logo.png")}
                style={styles.appleLogo}
              />
            </Button>
          </FadeView>

          <FadeView delay={550} enableBlur={false} translateYRange={[20, 0]}>
            <Button>
              <Text color="inverse" fontWeight="600">
                {t("onboarding.signUp.continueWithGoogle")}
              </Text>
              <Image
                source={require("@/assets/images/logos/google-logo.png")}
                style={styles.googleLogo}
              />
            </Button>
          </FadeView>
        </View>

        {continueWithoutAccount && (
          <>
            <FadeView delay={600} enableBlur={false}>
              <View style={styles.divider} />
            </FadeView>

            <FadeView delay={650} enableBlur={false} translateYRange={[20, 0]}>
              <Button
                disabled={loading}
                onPress={signUpAnonymous}
                testID="signInAnonymousButton"
                variant="inverse"
              >
                {loading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  t("onboarding.signUp.continueWithoutAccount")
                )}
              </Button>
            </FadeView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: SPACING.xs,
  },
  buttonsContainer: {
    gap: SPACING.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: `${THEME["foreground-muted"]}80`,
    marginVertical: SPACING.lg,
  },
  appleLogo: {
    width: 19,
    height: 24,
    position: "absolute",
    left: 14,
    top: 13,
  },
  googleLogo: {
    width: 23,
    height: 24,
    position: "absolute",
    left: 14,
    top: 15,
  },
});
