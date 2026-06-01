import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getTopRestaurantQuery = graphql(`
    query getTopRestaurant($limit: Int, $isCover: [Boolean!], $mimeType: [String!], $idCategory: [String!]) {
  places(limit: $limit, isCover: $isCover, mime_type: $mimeType, id_category: $idCategory) {
    places {
      id
      name
      state {
        name
      }
      medias {
        url
      }
    }
  }
}
`);

export function useGetTopRestaurant(categoryId: string) {
  return useQuery({
    queryKey: ["top-places", categoryId],
    queryFn: () =>
      gqlClient.request(getTopRestaurantQuery, {
        limit: 10,
        isCover: true,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        idCategory: [categoryId],
      }),
    select: (data) => data.places.places,
  });
}
