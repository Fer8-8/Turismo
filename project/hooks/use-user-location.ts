import {
  LocationAccuracy,
  type LocationSubscription,
  requestForegroundPermissionsAsync,
  reverseGeocodeAsync,
  watchPositionAsync,
} from "expo-location";
import { useEffect, useState } from "react";

type UserLocation = {
  city: string | null;
  country: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    city: null,
    country: null,
    region: null,
    latitude: null,
    longitude: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription: LocationSubscription | null = null;

    async function getUserLocation() {
      try {
        setIsLoading(true);

        const { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation({
            city: null,
            country: null,
            region: null,
            latitude: null,
            longitude: null,
            error: "Permission denied",
          });
          return;
        }

        subscription = await watchPositionAsync(
          {
            accuracy: LocationAccuracy.Balanced,
            distanceInterval: 1500,
          },
          async (location) => {
            const { latitude, longitude } = location.coords;

            const [address] = await reverseGeocodeAsync({
              latitude,
              longitude,
            });

            setLocation({
              city: address?.city ?? null,
              country: address?.country ?? null,
              region: address?.region ?? null,
              latitude,
              longitude,
              error: null,
            });
          }
        );
      } catch (err) {
        setLocation({
          city: null,
          country: null,
          region: null,
          latitude: null,
          longitude: null,
          error: err instanceof Error ? err.message : "Failed to get location",
        });
      } finally {
        setIsLoading(false);
      }
    }

    getUserLocation();

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    ...location,
    isLoading,
  };
}
