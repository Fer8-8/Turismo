import { expoClient } from "@better-auth/expo/client";
import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
// biome-ignore lint/performance/noNamespaceImport: i18next default export intentionally used
import * as SecureStore from "expo-secure-store";

const environment =
  (Constants.expoConfig?.extra?.environment as
    | "development"
    | "preview"
    | "production") || "development";

const SCHEME = "exploremexico";
const schemePrev = `${SCHEME}-prev`;
const schemeDev = `${SCHEME}-dev`;

const SCHEME_BY_ENV = {
  production: SCHEME,
  preview: schemePrev,
  development: schemeDev,
} as const;

export const authClient = createAuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/auth`,
  plugins: [
    expoClient({
      scheme: SCHEME_BY_ENV[environment],
      storagePrefix: "exploremexico",
      storage: SecureStore,
    }),
    anonymousClient(),
  ],
});
