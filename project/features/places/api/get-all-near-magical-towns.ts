import { useInfiniteQuery } from "@tanstack/react-query";
import { useGetCategories } from "@/features/home/api/get-categories";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getAllNearbyMagicalTownsQuery = graphql(`
  query getAllNearbyMagicalTowns($latitude: Float!, $longitude: Float!, $current: Int, $mimeType: [String!], $isCover: [Boolean!], $idCategory: [String!]) {
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

export function useGetAllNearbyMagicalTowns(
  latitude: number,
  longitude: number
) {
  const { data: categories } = useGetCategories();

  const magicalTownsCategory = categories?.find(
    (category) => category.category === "Pueblo Mágico"
  );

  return useInfiniteQuery({
    queryKey: ["all-nearby-magical-town", latitude, longitude],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getAllNearbyMagicalTownsQuery, {
        current: pageParam,
        latitude,
        longitude,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isCover: [true],
        idCategory: magicalTownsCategory?.id_category,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.nearbyPlaces.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      places: data.pages.flatMap((page) => page.nearbyPlaces.places),
      pageInfo: data.pages.at(-1)?.nearbyPlaces.info,
    }),
    enabled: !!magicalTownsCategory?.id_category,
  });
}
