import { useRouter } from "expo-router";
import { View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { ScrollContainer } from "@/components/scroll-container";
import { SPACING } from "@/lib/theme";
import { PlansHeader } from "../components/plans-header";
import { SavedPlanCard } from "../components/saved-plan-card";

export function PlansScreen() {
  const router = useRouter();

  function seePlanDetails() {
    router.push("/(tabs)/itinerary/itinerary-map");
  }

  return (
    <View style={{ flex: 1 }}>
      <FixedHeaderLayout>
        <PlansHeader />
      </FixedHeaderLayout>
      <View>
        <ScrollContainer>
          <View style={{ gap: SPACING.sm }}>
            <SavedPlanCard
              image="oaxaca"
              numPlaces={6}
              onPress={seePlanDetails}
              subtitle="Feb 14 - 18"
              text="Oaxaca"
            />

            <SavedPlanCard
              image="chiapas"
              numPlaces={4}
              onPress={seePlanDetails}
              subtitle="9 días, 8 noches"
              text="Yucatán"
            />

            <SavedPlanCard
              image="quintanaRoo"
              numPlaces={2}
              onPress={seePlanDetails}
              subtitle="Enero 10"
              text="Durango"
            />

            <SavedPlanCard
              image="jalisco"
              numPlaces={4}
              onPress={seePlanDetails}
              subtitle="2 días, 1 noche"
              text="Jalisco"
            />

            <SavedPlanCard
              image="bajaCaliforniaSur"
              numPlaces={10}
              onPress={seePlanDetails}
              subtitle="Julio 20 - 25"
              text="Baja California Sur"
            />

            <SavedPlanCard
              image="chihuahua"
              numPlaces={2}
              onPress={seePlanDetails}
              subtitle="Sept 14 - 18"
              text="Chihuahua"
            />

            <SavedPlanCard
              image="guanajuato"
              numPlaces={8}
              onPress={seePlanDetails}
              subtitle="3 días, 2 noches"
              text="Guanajuato"
            />

            <SavedPlanCard
              image="guanajuato"
              numPlaces={8}
              onPress={seePlanDetails}
              subtitle="3 días, 2 noches"
              text="Guanajuato"
            />

            <SavedPlanCard
              image="veracruz"
              numPlaces={3}
              onPress={seePlanDetails}
              subtitle="6 días, 5 noches"
              text="Veracruz"
            />

            <SavedPlanCard
              image="veracruz"
              numPlaces={3}
              onPress={seePlanDetails}
              subtitle="6 días, 5 noches"
              text="Veracruz"
            />
          </View>
        </ScrollContainer>
      </View>
    </View>
  );
}
