import { Tabs } from "expo-router";
import { CustomTab } from "@/navigation/components/custom-tab";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTab {...props} />}>
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarButtonTestID: "explore-tab-button",
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarButtonTestID: "home-tab-button",
        }}
      />

      <Tabs.Screen
        name="itinerary"
        options={{
          title: "Itinerary",
          headerShown: false,
          tabBarButtonTestID: "itinerary-tab-button",
        }}
      />

      <Tabs.Screen
        name="options"
        options={{
          title: "Opciones",
          headerShown: false,
          tabBarButtonTestID: "options-tab-button",
        }}
      />
    </Tabs>
  );
}
