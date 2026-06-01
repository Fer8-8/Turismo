import Octicons from "@expo/vector-icons/Octicons";
import { Image } from "expo-image";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { RADIUS, SPACING, THEME } from "@/lib/theme";

type Place = {
  id: string;
  name: string;
  subtitle: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
};

type Day = {
  day: number;
  places: Place[];
};

// Placeholder data — Oaxaca itinerary
const ITINERARY: Day[] = [
  {
    day: 1,
    places: [
      {
        id: "1",
        name: "Zócalo de Oaxaca",
        subtitle: "Centro histórico",
        latitude: 17.0731,
        longitude: -96.7228,
      },
      {
        id: "2",
        name: "Templo de Santo Domingo",
        subtitle: "Arquitectura colonial",
        latitude: 17.0718,
        longitude: -96.7254,
      },
      {
        id: "3",
        name: "Monte Albán",
        subtitle: "Zona arqueológica",
        latitude: 17.0447,
        longitude: -96.7639,
      },
      {
        id: "4",
        name: "Mercado Benito Juárez",
        subtitle: "Gastronomía local",
        latitude: 17.0703,
        longitude: -96.7214,
      },
    ],
  },
  {
    day: 2,
    places: [
      {
        id: "5",
        name: "Hierve el Agua",
        subtitle: "Naturaleza",
        latitude: 16.8656,
        longitude: -96.2749,
      },
      {
        id: "6",
        name: "Mitla",
        subtitle: "Zona arqueológica",
        latitude: 16.927,
        longitude: -96.3433,
      },
      {
        id: "7",
        name: "Árbol del Tule",
        subtitle: "Naturaleza",
        latitude: 17.0472,
        longitude: -96.6336,
      },
      {
        id: "8",
        name: "Yagul",
        subtitle: "Zona arqueológica",
        latitude: 16.9626,
        longitude: -96.4631,
      },
    ],
  },
  {
    day: 3,
    places: [
      {
        id: "9",
        name: "Cuilapam de Guerrero",
        subtitle: "Historia",
        latitude: 16.9992,
        longitude: -96.7997,
      },
      {
        id: "10",
        name: "Zaachila",
        subtitle: "Cultura zapoteca",
        latitude: 16.9561,
        longitude: -96.7533,
      },
      {
        id: "11",
        name: "San Bartolo Coyotepec",
        subtitle: "Artesanías",
        latitude: 16.9989,
        longitude: -96.7294,
      },
    ],
  },
  {
    day: 4,
    places: [
      {
        id: "12",
        name: "Sierra Juárez",
        subtitle: "Ecoturismo",
        latitude: 17.2758,
        longitude: -96.4513,
      },
      {
        id: "13",
        name: "Capulálpam de Méndez",
        subtitle: "Pueblo Mágico",
        latitude: 17.3041,
        longitude: -96.4702,
      },
      {
        id: "14",
        name: "Ixtlán de Juárez",
        subtitle: "Naturaleza",
        latitude: 17.3395,
        longitude: -96.4843,
      },
    ],
  },
];

type CameraPosition = {
  coordinates: { latitude: number; longitude: number };
  zoom: number;
};

function getCenter(places: Place[]) {
  if (!places.length) {
    return { latitude: 17.0731, longitude: -96.7228 };
  }
  const lat = places.reduce((sum, p) => sum + p.latitude, 0) / places.length;
  const lng = places.reduce((sum, p) => sum + p.longitude, 0) / places.length;
  return { latitude: lat, longitude: lng };
}

export function PlacesMap() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // biome-ignore lint/suspicious/noExplicitAny: expo-maps ref type is not exported in alpha
  const appleMapsRef = useRef<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: expo-maps ref type is not exported in alpha
  const googleMapsRef = useRef<any>(null);

  const currentDay = ITINERARY[selectedDay];
  const places = currentDay.places;
  const center = useMemo(() => getCenter(places), [places]);

  const markers = places.map((p) => ({
    id: p.id,
    coordinates: { latitude: p.latitude, longitude: p.longitude },
    title: p.name,
  }));

  const polylineCoordinates = places.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  function focusPlace(place: Place) {
    setSelectedPlaceId(place.id);
    const position: CameraPosition = {
      coordinates: { latitude: place.latitude, longitude: place.longitude },
      zoom: 14,
    };
    if (Platform.OS === "ios") {
      appleMapsRef.current?.setCameraPosition(position);
    } else {
      googleMapsRef.current?.setCameraPosition(position, 400);
    }
  }

  function handleDayChange(index: number) {
    setSelectedDay(index);
    setSelectedPlaceId(null);
  }

  function openRouteInMaps() {
    if (!places.length) {
      return;
    }

    if (Platform.OS === "ios") {
      // Apple Maps: saddr = first, daddr = last, waypoints = middle stops
      const first = places[0];
      const last = places.at(-1);
      const waypoints = places
        .slice(1, -1)
        .map((p) => `${p.latitude},${p.longitude}`)
        .join("+");
      const base = `maps://?saddr=${first.latitude},${first.longitude}&daddr=${last.latitude},${last.longitude}`;
      const url = waypoints ? `${base}&waypoints=${waypoints}` : base;
      Linking.openURL(url).catch(() => {
        // Fallback to Apple Maps web URL
        Linking.openURL(
          `https://maps.apple.com/?saddr=${first.latitude},${first.longitude}&daddr=${last.latitude},${last.longitude}`
        );
      });
    } else {
      // Google Maps multi-stop format: /lat,lng/lat,lng/...
      const stops = places.map((p) => `${p.latitude},${p.longitude}`).join("/");
      Linking.openURL(`https://www.google.com/maps/dir/${stops}`);
    }
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        {Platform.OS === "ios" ? (
          <AppleMaps.View
            cameraPosition={{ coordinates: center, zoom: 11 }}
            markers={markers}
            polylines={[{ coordinates: polylineCoordinates }]}
            ref={appleMapsRef}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <GoogleMaps.View
            cameraPosition={{ coordinates: center, zoom: 11 }}
            markers={markers}
            polylines={[{ coordinates: polylineCoordinates }]}
            ref={googleMapsRef}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Back button */}
        <Pressable
          hitSlop={12}
          onPress={() => router.back()}
          style={[
            styles.mapButton,
            { top: insets.top + SPACING.sm, left: SPACING.lg },
          ]}
        >
          <Octicons color={THEME.foreground} name="chevron-left" size={22} />
        </Pressable>

        {/* Open in Maps button */}
        <Pressable
          hitSlop={12}
          onPress={openRouteInMaps}
          style={[
            styles.mapButton,
            styles.mapsButton,
            { top: insets.top + SPACING.sm, right: SPACING.lg },
          ]}
        >
          <Octicons color={THEME.foreground} name="location" size={16} />
          <Text style={styles.mapsButtonText} variant="caption">
            Abrir ruta
          </Text>
        </Pressable>
      </View>

      {/* Bottom content */}
      <View
        style={[styles.content, { paddingBottom: insets.bottom + SPACING.lg }]}
      >
        {/* Day selector */}
        <ScrollView
          contentContainerStyle={styles.daySelectorContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
        >
          {ITINERARY.map((day, index) => (
            <Pressable
              key={day.day}
              onPress={() => handleDayChange(index)}
              style={[
                styles.dayChip,
                selectedDay === index && styles.dayChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.dayChipText,
                  selectedDay === index && styles.dayChipTextSelected,
                ]}
                variant="bodySmall"
              >
                Día {day.day}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Places list */}
        <ScrollView
          contentContainerStyle={styles.placesListContent}
          showsVerticalScrollIndicator={false}
        >
          {places.map((place, index) => {
            const isSelected = selectedPlaceId === place.id;
            return (
              <Pressable
                key={place.id}
                onPress={() => focusPlace(place)}
                style={styles.placeItem}
              >
                {/* Timeline column */}
                <View style={styles.timelineColumn}>
                  <View
                    style={[
                      styles.numberBadge,
                      isSelected && styles.numberBadgeSelected,
                    ]}
                  >
                    <Text style={styles.numberText} variant="caption">
                      {index + 1}
                    </Text>
                  </View>
                  {index < places.length - 1 && (
                    <View style={styles.connector} />
                  )}
                </View>

                {/* Card */}
                <View
                  style={[
                    styles.placeCard,
                    isSelected && styles.placeCardSelected,
                  ]}
                >
                  <Image
                    contentFit="cover"
                    source={{ uri: place.imageUrl ?? IMAGE_PLACEHOLDER }}
                    style={styles.placeImage}
                  />
                  <View style={styles.placeInfo}>
                    <Text numberOfLines={1} variant="body">
                      {place.name}
                    </Text>
                    <Text color="muted" numberOfLines={1} variant="caption">
                      {place.subtitle}
                    </Text>
                  </View>
                  <Octicons
                    color={
                      isSelected ? THEME.selected : THEME["foreground-muted"]
                    }
                    name="chevron-right"
                    size={16}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 2,
  },
  mapButton: {
    position: "absolute",
    backgroundColor: THEME["surface-secondary"],
    borderRadius: RADIUS.full,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  mapsButton: {
    width: "auto",
    paddingHorizontal: SPACING.sm,
    flexDirection: "row",
    gap: SPACING.xs,
  },
  mapsButtonText: {
    color: THEME.foreground,
    fontWeight: "500",
  },
  content: {
    flex: 3,
    backgroundColor: THEME.surface,
  },
  daySelector: {
    flexGrow: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${THEME["foreground-muted"]}30`,
  },
  daySelectorContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  dayChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: THEME["surface-secondary"],
  },
  dayChipSelected: {
    borderColor: THEME.selected,
    backgroundColor: THEME["selected-overlay"],
  },
  dayChipText: {
    color: THEME.foreground,
  },
  dayChipTextSelected: {
    color: THEME.selected,
    fontWeight: "600",
  },
  placesListContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  placeItem: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  timelineColumn: {
    alignItems: "center",
    width: 24,
    paddingTop: SPACING.md,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: THEME.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  numberBadgeSelected: {
    backgroundColor: THEME.selected,
  },
  numberText: {
    color: THEME["primary-foreground"],
    fontWeight: "600",
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: `${THEME["foreground-muted"]}25`,
    marginVertical: SPACING.xs,
  },
  placeCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: THEME["surface-secondary"],
    borderRadius: RADIUS.lg,
    borderCurve: "continuous",
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  placeCardSelected: {
    borderColor: THEME.selected,
    backgroundColor: THEME["selected-overlay"],
  },
  placeImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
  },
  placeInfo: {
    flex: 1,
    gap: 2,
  },
});
