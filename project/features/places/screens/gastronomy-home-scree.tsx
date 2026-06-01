import { View } from "react-native";
import { useUserLocation } from "@/hooks/use-user-location";
import { SPACING } from "@/lib/theme";
import { NearRestaurantCard } from "../components/near-restaurant-card";
import { TopRestaurantCard } from "../components/top-restaurant-card";

export function GastronomyHomeScreen() {
  const { latitude, longitude } = useUserLocation();
  return (
    <View style={{ gap: SPACING["4xl"] }}>
      <TopRestaurantCard />
      {latitude && longitude ? (
        <NearRestaurantCard userLocation={{ latitude, longitude }} />
      ) : null}
    </View>
  );
}
