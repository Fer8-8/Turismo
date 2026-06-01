import { useLocalSearchParams, useRouter } from "expo-router";
import type { ValidRegions } from "@/gql/graphql";
import { useUserLocation } from "@/hooks/use-user-location";
import { PlacesListByDistance } from "../components/lists-places/place-list-by-distance";
import { PlacesList } from "../components/lists-places/places-list";
import { PlacesListByCategory } from "../components/lists-places/places-list-by-category";
import { PlacesListByState } from "../components/lists-places/places-list-by-state";
import { PlacesListCitiesByRegion } from "../components/lists-places/places-list-cities-by-region";

/**
 * Results List Screen that displays a list of places based on the search parameters.
 * - stateId: The ID of the state to filter by.
 * - categoryId: The ID of the category to filter by.
 * - byDistance: Whether to display places by user distance.
 * - regions: The regions to filter cities by.
 */
export function ResultsListScreen() {
  const { stateId, categoryId, byDistance, regions } = useLocalSearchParams<{
    stateId: string;
    categoryId: string;
    byDistance: string;
    regions: string | string[];
  }>();
  const router = useRouter();
  const { latitude, longitude } = useUserLocation();

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  if (regions) {
    const regionsArray = (
      Array.isArray(regions) ? regions : regions.split(",")
    ) as ValidRegions[];
    return (
      <PlacesListCitiesByRegion
        navigateToPlace={navigateToPlace}
        regions={regionsArray}
      />
    );
  }

  if (categoryId) {
    return (
      <PlacesListByCategory
        categoryId={categoryId}
        navigateToPlace={navigateToPlace}
      />
    );
  }

  if (stateId) {
    return (
      <PlacesListByState navigateToPlace={navigateToPlace} stateId={stateId} />
    );
  }

  if (byDistance === "true") {
    return (
      <PlacesListByDistance
        navigateToPlace={navigateToPlace}
        userLatitude={latitude ?? 0}
        userLongitude={longitude ?? 0}
      />
    );
  }

  return <PlacesList navigateToPlace={navigateToPlace} />;
}
