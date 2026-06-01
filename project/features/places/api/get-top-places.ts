import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getTopPlacesQuery = graphql(`
    query getTopPlaces($limit: Int, $isCover: [Boolean!], $mimeType: [String!]) {
  places(limit: $limit, isCover: $isCover, mime_type: $mimeType) {
    places {
      name
      state {
        name
      }
      id
      medias {
        url
      }
    }
  }
}
`);

export function useGetTopPlaces() {
  return useQuery({
    queryKey: ["top-places"],
    queryFn: () =>
      gqlClient.request(getTopPlacesQuery, {
        limit: 10,
        isCover: true,
        mimeType: QUERY_IMAGE_MIME_TYPES,
      }),
    select: (data) => data.places.places,
  });
}
