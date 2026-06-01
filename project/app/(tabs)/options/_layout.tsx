import { Stack } from "expo-router";
import { THEME } from "@/lib/theme";

export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Opciones",
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: "Configuración",
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="sign-up"
        options={{
          title: "Crear cuenta",
          headerShown: false,
          presentation: "modal",
          // gestureEnabled: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />
    </Stack>
  );
}
