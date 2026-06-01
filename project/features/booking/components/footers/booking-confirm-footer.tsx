import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";
import { BookingSuccess } from "../booking-success";

export function BookingConfirmFooter() {
  const { pushContent, expandToMax } = useTabActions();

  function handleConfirm() {
    pushContent(() => <BookingSuccess />, {
      footerContent: undefined,
    });
    // to show the payment confirmation, ensure the sheet is expanded to max
    // so the user can see all the details
    expandToMax();
  }

  return (
    <View style={styles.footer}>
      <Button onPress={handleConfirm} style={styles.button}>
        <View>
          <Text color="inverse">Confirmar pago</Text>
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
