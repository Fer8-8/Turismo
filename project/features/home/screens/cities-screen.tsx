import { StyleSheet, View } from "react-native";
import { CenterCities } from "@/features/places/components/cities/center-cities";
import { NorthCities } from "@/features/places/components/cities/north-cities";
import { SouthCities } from "@/features/places/components/cities/south-cities";
import { OfficialGuides } from "@/features/planner/components/official-guides";
import { PopularGuidesList } from "@/features/planner/components/popular-guides-list";
import { SPACING } from "@/lib/theme";

export function CitiesScreen() {
  return (
    <>
      <PopularGuidesList />
      <View style={styles.content}>
        <CenterCities />
        <SouthCities />
        <NorthCities />
      </View>
      <View style={styles.section}>
        <OfficialGuides />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING["4xl"],
    marginTop: SPACING["4xl"],
  },
  section: {
    marginTop: SPACING["4xl"],
  },
});
