import { Stack } from "expo-router";
import { THEME } from "@/lib/theme";

export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "itinerary",
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="new-itinerary"
        options={{
          title: "itinerary",
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="itinerary-map"
        options={{
          title: "itinerary",
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />
    </Stack>
  );
}
