import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { NavigationButtons } from "./navigation-buttons";

type NavigationWithActionProps = BottomTabBarProps & {
  actionContent: (() => React.ReactNode) | null;
};

export function NavigationWithAction({
  actionContent,
  ...props
}: NavigationWithActionProps) {
  return (
    <View style={styles.container}>
      <NavigationButtons {...props} />
      <View style={styles.divider} />
      {actionContent ? actionContent() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingRight: 4,
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "#ffffff30",
  },
});
