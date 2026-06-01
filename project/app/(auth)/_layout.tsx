import { Stack } from "expo-router";
import { THEME } from "@/lib/theme";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Inicio",
          headerShown: false,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="preferences"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
          presentation: "modal",
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />
    </Stack>
  );
}
