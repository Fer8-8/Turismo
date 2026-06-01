import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  type SafeAreaViewProps,
} from "react-native-safe-area-context";
import { SPACING, THEME } from "@/lib/theme";

export type FullPageContainerProps = SafeAreaViewProps & {};

export const FullPageContainer = ({
  style,
  children,
  ...otherProps
}: FullPageContainerProps) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: THEME.surface,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
});
