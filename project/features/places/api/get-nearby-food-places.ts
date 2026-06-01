import { useInfiniteQuery } from "@tanstack/react-query";
import { useGetCategories } from "@/features/home/api/get-categories";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getNearbyFoodPlacesQuery = graphql(`
  query getNearbyFoodPlaces($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!], $limit: Int) {
    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory, limit: $limit) {
      places {
        id
        name
        latitude
        longitude
        category {
           category
        }
        medias {
           url
        }
        state {
          name
        }
      }
      info {
        next
        pages
        prev
      }
    }
  }
`);

export function useGetNearbyFoodPlaces(
  latitude: number,
  longitude: number,
  limit?: number
) {
  const { data: categories } = useGetCategories();

  const foodCategory = categories?.find(
    (category) => category.category === "Gastronomia"
  );

  return useInfiniteQuery({
    queryKey: ["all-nearby-food-places", latitude, longitude, limit],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getNearbyFoodPlacesQuery, {
        current: pageParam,
        latitude,
        longitude,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isCover: [true],
        idCategory: foodCategory?.id_category,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.nearbyPlaces.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      places: data.pages.flatMap((page) => page.nearbyPlaces.places),
      pageInfo: data.pages.at(-1)?.nearbyPlaces.info,
    }),
    enabled: !!foodCategory?.id_category,
  });
}
