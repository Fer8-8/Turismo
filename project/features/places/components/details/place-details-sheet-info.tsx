import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useGetPlaceById } from "@/features/places/api/get-place-by-id";
import { RADIUS, SPACING } from "@/lib/theme";
import { PlaceLocationMap } from "../place-location-map";
import { ArchaeologicalZoneDetails } from "./archaeological-zone-details";
import { BeachDetails } from "./beach-details";
import { CultureDetails } from "./culture-details";
import { EntertainmentDetails } from "./entertainment-details";
import { MagicTownDetails } from "./magic-town-details";
import { NatureDetails } from "./nature-details";
import { NightlifeDetails } from "./nightlife-details";
import { PlaceActivities } from "./place-activities";
import { PlaceDetailsGallery } from "./place-details-gallery";
import { PlaceInfo } from "./place-info";
import { RestaurantDetails } from "./restaurant-details";

type MagicalTownSheetInfoProps = {
  placeId: string;
};

export function PlaceDetailsSheetInfo({ placeId }: MagicalTownSheetInfoProps) {
  const { data: place } = useGetPlaceById(placeId);
  if (!place) {
    return null;
  }

  const showBadges = place.isUnescoHeritage || place.isProtectedArea;

  return (
    <View style={styles.container}>
      <PlaceInfo
        category={place?.category || ""}
        description={place?.description || ""}
        name={place?.name || ""}
      />

      {showBadges && (
        <View style={styles.badges}>
          {place.isUnescoHeritage && (
            <View style={[styles.badge, styles.unescoBackground]}>
              <Ionicons color="#1d4ed8" name="earth" size={14} />
              <Text style={[styles.badgeText, styles.unescoText]}>
                Patrimonio UNESCO
              </Text>
            </View>
          )}
          {place.isProtectedArea && (
            <View style={[styles.badge, styles.protectedBackground]}>
              <Ionicons color="#15803d" name="leaf" size={14} />
              <Text style={[styles.badgeText, styles.protectedText]}>
                Área protegida
              </Text>
            </View>
          )}
        </View>
      )}

      {place.details && (
        <View style={styles.placeSection}>
          {place.category === "Gastronomia" && (
            <RestaurantDetails {...place.details} />
          )}
          {place.category === "Cultura" && (
            <CultureDetails {...place.details} />
          )}
          {place.category === "Entretenimiento" && (
            <EntertainmentDetails {...place.details} />
          )}
          {place.category === "Naturaleza" && (
            <NatureDetails {...place.details} />
          )}
          {place.category === "Playa" && <BeachDetails {...place.details} />}
          {place.category === "Pueblo Mágico" && (
            <MagicTownDetails {...place.details} />
          )}
          {place.category === "Vida Nocturna" && (
            <NightlifeDetails {...place.details} />
          )}
          {place.category === "Zona arqueológica" && (
            <ArchaeologicalZoneDetails {...place.details} />
          )}
        </View>
      )}

      <View style={styles.placeSection}>
        <PlaceActivities placeId={placeId} />
      </View>

      {place.latitude && place.longitude ? (
        <View style={styles.placeSection}>
          <PlaceLocationMap
            placeLat={place.latitude}
            placeLng={place.longitude}
            title={place?.name || ""}
          />
        </View>
      ) : null}

      <View style={styles.placeSection}>
        <PlaceDetailsGallery placeId={placeId} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING["6xl"],
  },
  placeSection: {
    marginTop: SPACING["2xl"],
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  unescoBackground: {
    backgroundColor: "#dbeafe",
  },
  unescoText: {
    color: "#1d4ed8",
  },
  protectedBackground: {
    backgroundColor: "#dcfce7",
  },
  protectedText: {
    color: "#15803d",
  },
});
