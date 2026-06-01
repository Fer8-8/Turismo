import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FullPageContainer } from "@/components/full-page-container";
import { OptionsItem } from "@/components/options-item";
import { Avatar } from "@/features/profile/components/avatar";
import { authClient } from "@/lib/auth-client";
import { SPACING, THEME } from "@/lib/theme";

export default function OptionsScreen() {
  const { data: session, isPending } = authClient.useSession();
  const { t } = useTranslation();
  const router = useRouter();

  // if (session?.user?.isAnonymous) {
  //   return (
  //     <FullPageContainer style={{ paddingBottom: NAVIGATION_HEIGTH }}>
  //       <SignIn />
  //     </FullPageContainer>
  //   );
  // }

  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={THEME.foreground} size="large" />
      </View>
    );
  }
  return (
    <FullPageContainer>
      <Avatar
        email={session?.user?.email ?? ""}
        isUserAnonymous={session?.user?.isAnonymous ?? false}
        name={session?.user?.name ?? ""}
      />

      <View style={styles.options}>
        <OptionsItem
          disabled={session?.user?.isAnonymous ?? false}
          leftIcon={
            <Octicons color={THEME.foreground} name="heart" size={18} />
          }
          rightIcon={
            <Octicons color={THEME.foreground} name="chevron-right" size={18} />
          }
          testLabel="favorites"
          text={t("options.links.favorites")}
        />

        <OptionsItem
          leftIcon={
            <Octicons color={THEME.foreground} name="sliders" size={18} />
          }
          onPress={() => router.push("/options/settings")}
          rightIcon={
            <Octicons color={THEME.foreground} name="chevron-right" size={18} />
          }
          testLabel="settings"
          text={t("options.links.settings")}
        />

        {/*<OptionsItem
          leftIcon={
            <Octicons color={THEME.foreground} name="question" size={18} />
          }
          rightIcon={
            <Octicons color={THEME.foreground} name="chevron-right" size={18} />
          }
          testLabel="help"
          text={t("options.links.help")}
        />*/}
      </View>
    </FullPageContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  options: {
    marginTop: SPACING["2xl"],
    gap: SPACING.xs,
  },
});
