import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { LargeTitle } from "@/components/ui/large-title";
import { Text } from "@/components/ui/text";
import { LAYOUT, SPACING, THEME } from "@/lib/theme";

export function SignIn() {
  return (
    <View style={LAYOUT.flex1}>
      <View style={LAYOUT.flex1}>
        <View style={{ zIndex: 1 }}>
          <LargeTitle>Iniciar Sesión</LargeTitle>
          <Text>Inicia sesión y disfruta de la mejor experiencia posible</Text>
        </View>
        <View style={[LAYOUT.flex1, LAYOUT.center]}>
          <Image
            source={require("@/assets/images/states/sonora-state.png")}
            style={{
              width: 146,
              height: 160,
              position: "absolute",
              top: -SPACING["2xl"],
              left: -SPACING.xl,
            }}
          />

          <Image
            source={require("@/assets/stickers/sticker-face.png")}
            style={{
              width: 76,
              height: 86,
              position: "absolute",
              top: SPACING.xl,
              left: SPACING.lg,
              transform: [{ rotate: "-10deg" }],
            }}
          />

          <Image
            source={require("@/assets/images/states/nuevo-leon-state.png")}
            style={{
              width: 97,
              height: 179,
              position: "absolute",
              bottom: SPACING["2xl"],
              left: SPACING.xl,
              transform: [{ rotate: "40deg" }],
            }}
          />

          <Image
            source={require("@/assets/images/states/zacatecas-state.png")}
            style={{
              width: 138,
              height: 177,
              position: "absolute",
              top: SPACING.xl,
              right: SPACING.sm,
            }}
          />

          <Image
            source={require("@/assets/images/states/tabasco-state.png")}
            style={{
              width: 192,
              height: 89,
              position: "absolute",
              bottom: SPACING.xl,
              right: -SPACING.xl,
              transform: [{ rotate: "15deg" }],
            }}
          />

          <Image
            source={require("@/assets/stickers/sticker-wheel-fortune.png")}
            style={{
              width: 195,
              height: 188,
            }}
          />

          <Image
            source={require("@/assets/stickers/sticker-bridge.png")}
            style={{
              width: 89,
              height: 75,
              position: "absolute",
              top: SPACING["2xl"],
              right: SPACING.lg,
              transform: [{ rotate: "15deg" }],
            }}
          />
        </View>
      </View>

      <View>
        <View style={styles.buttonsContainer}>
          <Button>
            <Text color="inverse" fontWeight="600">
              Continuar con Apple
            </Text>
            <Image
              source={require("@/assets/images/logos/apple-logo.png")}
              style={styles.appleLogo}
            />
          </Button>

          <Button>
            <Text color="inverse" fontWeight="600">
              Continuar con Google
            </Text>
            <Image
              source={require("@/assets/images/logos/google-logo.png")}
              style={styles.googleLogo}
            />
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
