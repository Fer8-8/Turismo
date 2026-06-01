import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";

export function BookingSuccess() {
  const { popToRoot } = useTabActions();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons color={THEME.primary} name="checkmark-circle" size={64} />
      </View>
      <Text style={styles.title} variant="subtitle">
        ¡Reserva confirmada!
      </Text>
      <Text style={styles.subtitle}>
        Te enviaremos los detalles a tu correo.
      </Text>
      <Button onPress={popToRoot} style={styles.button} variant="secondary">
        Volver al lugar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: SPACING["4xl"],
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  button: {
    marginTop: SPACING.xl,
    alignSelf: "stretch",
  },
});
