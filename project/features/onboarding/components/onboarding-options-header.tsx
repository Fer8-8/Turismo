import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation } from "expo-router";
import { StyleSheet, View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { Button } from "@/components/ui/button";
import { THEME } from "@/lib/theme";
import { OnboardingAnimatedPagination } from "./onboarding-animated-pagination";

type OnboardingOptionsHeaderProps = {
  currentStep: number;
};

export function OnboardingOptionsHeader({
  currentStep,
}: OnboardingOptionsHeaderProps) {
  const navigation = useNavigation();

  function handleGoBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <FixedHeaderLayout>
      <View style={styles.container}>
        <Button onPress={handleGoBack} style={styles.action}>
          <Octicons color={THEME.foreground} name="x" size={24} />
        </Button>

        <OnboardingAnimatedPagination currentStep={currentStep} />

        <Button style={styles.action}>
          <Octicons color={THEME.foreground} name="question" size={24} />
        </Button>
      </View>
    </FixedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  action: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 38,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
});
