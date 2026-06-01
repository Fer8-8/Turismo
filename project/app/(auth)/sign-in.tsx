import { FullPageContainer } from "@/components/full-page-container";
import { SignUp } from "@/features/auth/screens/sign-up";
import { SPACING } from "@/lib/theme";

export default function SignInScreen() {
  return (
    <FullPageContainer style={{ paddingTop: SPACING.xl }}>
      <SignUp continueWithoutAccount={false} />
    </FullPageContainer>
  );
}
