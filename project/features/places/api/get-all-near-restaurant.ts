import { useInfiniteQuery } from "@tanstack/react-query";
import { useGetCategories } from "@/features/home/api/get-categories";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getAllNearRestaurantQuery = graphql(`
  query getAllNearRestaurant($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!]) {
    nearbyPlaces(latitude: $latitude, longitude: $longitude, current: $current, mime_type: $mimeType, isCover: $isCover, id_category: $idCategory) {
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

export function useGetAllNearRestaurant(latitude: number, longitude: number) {
  const { data: categories } = useGetCategories();

  const restaurantCategory = categories?.find(
    (category) => category.category === "Gastronomia"
  );

  return useInfiniteQuery({
    queryKey: ["all-nearby-places", latitude, longitude],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getAllNearRestaurantQuery, {
        current: pageParam,
        latitude,
        longitude,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isCover: [true],
        idCategory: restaurantCategory?.id_category
          ? [restaurantCategory.id_category]
          : undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.nearbyPlaces.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      places: data.pages.flatMap((page) => page.nearbyPlaces.places),
      pageInfo: data.pages.at(-1)?.nearbyPlaces.info,
    }),
    enabled: !!restaurantCategory?.id_category,
  });
}
