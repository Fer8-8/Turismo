import Octicons from "@expo/vector-icons/Octicons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { THEME } from "@/lib/theme";

const icons = {
  home: (color: string) => (
    <Octicons color={color} name="telescope" size={24} />
  ),
  explore: (color: string) => (
    <Octicons color={color} name="home-fill" size={24} />
  ),
  options: (color: string) => (
    <Octicons color={color} name="person-fill" size={24} />
  ),
  itinerary: (color: string) => (
    <Octicons color={color} name="sparkle-fill" size={24} />
  ),
};

const TAB_BUTTON_SIZE = 56;

export function NavigationButtons({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.navigationBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        // const label =
        //   options.tabBarLabel !== undefined
        //     ? options.tabBarLabel
        //     : options.title !== undefined
        //       ? options.title
        //       : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!(isFocused || event.defaultPrevented)) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const iconColor = isFocused
          ? THEME["active-tab"]
          : THEME["inactive-tab"];

        return (
          <PlatformPressable
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityState={isFocused ? { selected: true } : {}}
            href={buildHref(route.name, route.params)}
            key={route.key}
            onLongPress={onLongPress}
            onPress={onPress}
            pressOpacity={0.9}
            style={[styles.link]}
            testID={options.tabBarButtonTestID}
          >
            {icons[route.name]?.(iconColor)}
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  link: {
    width: TAB_BUTTON_SIZE,
    height: TAB_BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
});
