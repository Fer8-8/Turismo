import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";
import { useTabActions } from "@/navigation/store/tab-store";
import { BookingOptions } from "../booking-options";
import { BookingOptionsFooter } from "./booking-options-footer";

export function BookFooter() {
  const { pushContent } = useTabActions();

  function showBookingOptions() {
    pushContent(() => <BookingOptions />, {
      bottomSpacing: 0,
      width: "full",
      enableBottomSheet: true,
      snapPoints: [0.3, 0.9],
      footerContent: () => <BookingOptionsFooter />,
    });
  }

  return (
    <View style={styles.footer}>
      <Button onPress={showBookingOptions} style={styles.bookAction}>
        <View>
          <Text color="inverse">Reservar</Text>
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
  bookAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
