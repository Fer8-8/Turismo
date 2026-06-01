import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollContainer } from "@/components/scroll-container";
import { SignUp } from "@/features/auth/screens/sign-up";
import { LanguageSelector } from "@/features/settings/screens/language-selector";
import { LAYOUT, SPACING } from "@/lib/theme";
import { OnboardingOptionsHeader } from "../components/onboarding-options-header";
import { Tastes } from "./tastes";

export function Onboarding() {
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState(1);

  return (
    <View style={LAYOUT.flex1}>
      <OnboardingOptionsHeader currentStep={currentStep} />
      <ScrollContainer
        contentContainerStyle={{
          ...LAYOUT.flex1,
          paddingBottom: insets.bottom,
        }}
        style={{
          paddingTop: SPACING.md,
        }}
      >
        {currentStep === 1 && (
          <LanguageSelector onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && <Tastes onNext={() => setCurrentStep(3)} />}
        {currentStep === 3 && <SignUp />}
      </ScrollContainer>
    </View>
  );
}
