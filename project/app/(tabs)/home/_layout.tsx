import { Stack } from "expo-router";
import { THEME } from "@/lib/theme";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="search"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="[place]"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="state/[state]"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />

      <Stack.Screen
        name="results"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: THEME.surface,
          },
        }}
      />
    </Stack>
  );
}
