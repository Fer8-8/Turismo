import { View } from "react-native";
import { SavedPlanCard } from "@/features/planner/components/saved-plan-card";

export function SearchCard() {
  return (
    <View>
      <View style={{ gap: 10 }}>
        <SavedPlanCard
          image="oaxaca"
          numPlaces={9}
          subtitle="Feb 14 - 18"
          text="Oaxaca"
        />
        <SavedPlanCard
          image="chiapas"
          numPlaces={4}
          subtitle="9 días, 8 noches"
          text="Yucatán"
        />
        <SavedPlanCard
          image="quintanaRoo"
          numPlaces={2}
          subtitle="Enero 10"
          text="Durango"
        />
        <SavedPlanCard
          image="jalisco"
          numPlaces={4}
          subtitle="2 días, 1 noche"
          text="Jalisco"
        />
        <SavedPlanCard
          image="bajaCaliforniaSur"
          numPlaces={10}
          subtitle="Julio 20 - 25"
          text="Baja California Sur"
        />
        <SavedPlanCard
          image="chihuahua"
          numPlaces={2}
          subtitle="Sept 14 - 18"
          text="Chihuahua"
        />
        <SavedPlanCard
          image="guanajuato"
          numPlaces={8}
          subtitle="3 días, 2 noches"
          text="Guanajuato"
        />
        <SavedPlanCard
          image="guanajuato"
          numPlaces={8}
          subtitle="3 días, 2 noches"
          text="Guanajuato"
        />
        <SavedPlanCard
          image="veracruz"
          numPlaces={3}
          subtitle="6 días, 5 noches"
          text="Veracruz"
        />
        <SavedPlanCard
          image="veracruz"
          numPlaces={3}
          subtitle="6 días, 5 noches"
          text="Veracruz"
        />
      </View>
    </View>
  );
}
