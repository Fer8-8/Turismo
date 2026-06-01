import { Ionicons } from "@expo/vector-icons";
import { canOpenURL, openURL } from "expo-linking";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform, StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { RADIUS, SPACING } from "@/lib/theme";

type PlaceLocationMapProps = {
  placeLat: number;
  placeLng: number;
  title: string;
};

export function PlaceLocationMap({
  placeLat,
  placeLng,
  title,
}: PlaceLocationMapProps) {
  const camera = {
    coordinates: {
      latitude: placeLat,
      longitude: placeLng,
    },
    zoom: 15,
  };

  const marker = {
    coordinates: {
      latitude: placeLat,
      longitude: placeLng,
    },
    title: title || "",
  };

  function openAppleMaps() {
    const label = encodeURIComponent(title ?? "");
    const url = `maps:0,0?q=${label}@${placeLat},${placeLng}`;
    openURL(url);
  }

  function openGoogleMaps() {
    const label = encodeURIComponent(title ?? "");
    const googleMapsApp = `comgooglemaps://?q=${label}&center=${placeLat},${placeLng}&zoom=15`;
    const googleMapsFallback = `https://www.google.com/maps/search/?api=1&query=${label}&query_place_id=${placeLat},${placeLng}`;

    canOpenURL(googleMapsApp).then((supported) => {
      openURL(supported ? googleMapsApp : googleMapsFallback);
    });
  }

  return (
    <View style={styles.mapContainer}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Platform.OS === "ios" && (
          <AppleMaps.View
            cameraPosition={camera}
            markers={[
              {
                ...marker,
                systemImage: "building.columns",
              },
            ]}
            properties={{
              isMyLocationEnabled: false,
              selectionEnabled: false,
              pointsOfInterest: { including: [] },
            }}
            style={styles.map}
            uiSettings={{
              myLocationButtonEnabled: false,
              togglePitchEnabled: false,
              compassEnabled: false,
              scaleBarEnabled: false,
            }}
          />
        )}

        {Platform.OS === "android" && (
          <GoogleMaps.View
            cameraPosition={camera}
            markers={[marker]}
            properties={{
              isMyLocationEnabled: false,
              selectionEnabled: false,
            }}
            style={styles.map}
            uiSettings={{
              myLocationButtonEnabled: false,
              compassEnabled: false,
              scaleBarEnabled: false,
              zoomControlsEnabled: false,
              scrollGesturesEnabled: false,
              zoomGesturesEnabled: false,
              rotationGesturesEnabled: false,
              tiltGesturesEnabled: false,
            }}
          />
        )}
      </View>

      <View style={styles.actions}>
        {Platform.OS === "ios" && (
          <Button
            onPress={openAppleMaps}
            style={styles.iconButton}
            variant="inverse"
          >
            <Ionicons color="#000" name="logo-apple" size={20} />
          </Button>
        )}

        <Button
          onPress={openGoogleMaps}
          style={styles.iconButton}
          variant="inverse"
        >
          <Ionicons color="#000" name="logo-google" size={20} />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 300,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  actions: {
    position: "absolute",
    right: SPACING.sm,
    bottom: SPACING.sm,
    flexDirection: "row",
    gap: SPACING.xs,
  },
  iconButton: {
    paddingHorizontal: 0,
    height: 38,
    width: 38,
  },
});
