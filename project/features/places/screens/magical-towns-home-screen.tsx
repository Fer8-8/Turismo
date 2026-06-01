import { StyleSheet, View } from "react-native";
import { MostPopularMagicalTownList } from "@/features/places/components/magical-towns/most-popular-magical-town-list";
import { NearMagicalTownList } from "@/features/places/components/magical-towns/near-magical-town-list";
import { UniqueExperiencesList } from "@/features/places/components/unique-experiences-list";
import { useUserLocation } from "@/hooks/use-user-location";
import { SPACING } from "@/lib/theme";
import { StatesGrid } from "../../magical-towns/components/states-grid";

export function MagicalTownsHomeScreen() {
  const { latitude, longitude } = useUserLocation();
  return (
    <>
      <MostPopularMagicalTownList />
      {latitude && longitude ? (
        <View style={styles.section}>
          <NearMagicalTownList userLocation={{ latitude, longitude }} />
        </View>
      ) : null}
      <View style={styles.content}>
        <UniqueExperiencesList />
        <StatesGrid />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING["4xl"],
    gap: SPACING["4xl"],
  },
  section: {
    marginTop: SPACING["4xl"],
  },
});
