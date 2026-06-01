import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";
import { BookingConfirmPayment } from "../booking-confirm-payment";
import { BookingConfirmFooter } from "./booking-confirm-footer";

export function BookingOptionsFooter() {
  const { pushContent } = useTabActions();

  function handleContinue() {
    pushContent(() => <BookingConfirmPayment />, {
      footerContent: () => <BookingConfirmFooter />,
    });
  }

  return (
    <View style={styles.footer}>
      <Button onPress={handleContinue} style={styles.button}>
        <View>
          <Text color="inverse">Continuar</Text>
        </View>
        <Text color="inverse" fontWeight="700">
          $ 350 MXN
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING["2xl"],
    paddingTop: SPACING.lg,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
