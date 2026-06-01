import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getMostPopularPlacesQuery = graphql(`
  query GetMostPopularPlaces($limit: Int, $isCover: [Boolean!]) {
    places(limit: $limit, isCover: $isCover) {
      places {
        id
        name
        medias {
          url
        }
        state {
          name
        }
      }
    }
  }
`);

export function useGetMostPopularPlaces() {
  return useQuery({
    queryFn: () =>
      gqlClient.request(getMostPopularPlacesQuery, {
        limit: 10,
        isCover: [true],
        mimeType: QUERY_IMAGE_MIME_TYPES,
      }),
    queryKey: ["most-popular-places"],
    select: (data) => data.places.places,
  });
}
