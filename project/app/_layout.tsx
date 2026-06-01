import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "@/lib/locales/i18n";
// biome-ignore lint/performance/noNamespaceImport: sentry config
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { usePreferencesStore } from "@/features/onboarding/store/preferences-store";
import { authClient } from "@/lib/auth-client";
import { LAYOUT } from "@/lib/theme";

Sentry.init({
  dsn: "https://5ca86cee5f97ae6a4eeb8a2bfe71ea2b@o4511125045706752.ingest.us.sentry.io/4511125048262656",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();

export default Sentry.wrap(function RootLayout() {
  const { data: session, isPending } = authClient.useSession();

  const hasCompletedOnboarding = usePreferencesStore(
    (s) => s.hasCompletedOnboarding
  );

  const shouldSeeOnboarding = !(session && hasCompletedOnboarding);

  if (isPending) {
    return (
      <View style={[LAYOUT.flex1, LAYOUT.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <KeyboardProvider>
            <Stack>
              <Stack.Protected guard={shouldSeeOnboarding}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack.Protected>

              <Stack.Protected guard={!shouldSeeOnboarding}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack.Protected>
            </Stack>
          </KeyboardProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
});
