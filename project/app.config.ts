import type { ConfigContext, ExpoConfig } from "expo/config";
import { version } from "./package.json";

const EAS_PROJECT_ID = "30b90016-156e-4c80-a91f-e3217eb67c91";
const PROJECT_SLUG = "explore-mexico";
const OWNER = "seanalytics";

// App production config
const APP_NAME = "Explore México";
const BUNDLE_IDENTIFIER = "com.seanalytics.exploremexico";
const PACKAGE_NAME = "com.seanalytics.exploremexico";
const SCHEME = "exploremexico";

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  const {
    name,
    bundleIdentifier,
    packageName,
    scheme,
    iosDarkIcon,
    iosLightIcon,
    iosTintedIcon,
    androidAdaptiveIcon,
    splashIcon,
  } = getDynamicAppConfig(
    (process.env.APP_ENV as "development" | "preview" | "production") ||
      "development"
  );

  return {
    ...config,
    name,
    slug: PROJECT_SLUG,
    version, // Automatically bump the project version with `npm version patch`, `npm version minor` or `npm version major`.
    orientation: "portrait",
    scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: {
        dark: iosDarkIcon,
        light: iosLightIcon,
        tinted: iosTintedIcon,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
        foregroundImage: androidAdaptiveIcon,
        backgroundImage: androidAdaptiveIcon,
        monochromeImage: androidAdaptiveIcon,
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: packageName,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: splashIcon,
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#ffffff",
          },
        },
      ],
      "expo-video",
      [
        "expo-font",
        {
          fonts: ["./assets/fonts/Nunito-VariableFont_wght.ttf"],
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Explore México to use your location.",
        },
      ],
      [
        "expo-maps",
        {
          requestLocationPermission: false,
        },
      ],
      "expo-localization",
      "expo-secure-store",
      "expo-color-space-plugin",
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "react-native",
          organization: "seanalytics",
        },
      ],
    ],
    updates: {
      url: "https://u.expo.dev/30b90016-156e-4c80-a91f-e3217eb67c91",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      environment: process.env.APP_ENV || "development",
    },
    owner: OWNER,
  };
};

// Dynamically configure the app based on the environment.
export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      scheme: SCHEME,
      iosDarkIcon: "./assets/app/ios/prod/ios-dark-prod.png",
      iosLightIcon: "./assets/app/ios/prod/ios-light-prod.png",
      iosTintedIcon: "./assets/app/ios/prod/ios-tinted-prod.png",
      androidAdaptiveIcon: "./assets/app/android/prod/adaptive-icon-prod.png",
      splashIcon: "./assets/app/splash/splash-icon-prod.png",
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      scheme: `${SCHEME}-prev`,
      iosDarkIcon: "./assets/app/ios/dev/ios-dark-dev.png",
      iosLightIcon: "./assets/app/ios/dev/ios-light-dev.png",
      iosTintedIcon: "./assets/app/ios/dev/ios-tinted-dev.png",
      androidAdaptiveIcon: "./assets/app/android/dev/adaptive-icon-dev.png",
      splashIcon: "./assets/app/splash/splash-icon-dev.png",
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    scheme: `${SCHEME}-dev`,
    iosDarkIcon: "./assets/app/ios/dev/ios-dark-dev.png",
    iosLightIcon: "./assets/app/ios/dev/ios-light-dev.png",
    iosTintedIcon: "./assets/app/ios/dev/ios-tinted-dev.png",
    androidAdaptiveIcon: "./assets/app/android/dev/adaptive-icon-dev.png",
    splashIcon: "./assets/app/splash/splash-icon-dev.png",
  };
};
