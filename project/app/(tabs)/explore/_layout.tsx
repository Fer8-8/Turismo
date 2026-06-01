import { Stack } from "expo-router";
import { THEME } from "@/lib/theme";

export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Explorar",
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="[place]"
        options={{
          title: "Detalles",
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />
    </Stack>
  );
}
