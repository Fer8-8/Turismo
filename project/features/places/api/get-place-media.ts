import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getPlaceMediaQuery = graphql(`
  query getPlaceMedia($placeId: [String!], $mimeType: [String!]) {
    allMedia(place_id: $placeId, mime_type: $mimeType) {
      media {
        id
        url
      }
    }
  }
`);

export function useGetPlaceMedia(placeId: string) {
  return useQuery({
    queryFn: () =>
      gqlClient.request(getPlaceMediaQuery, {
        placeId: [placeId],
        mimeType: QUERY_IMAGE_MIME_TYPES,
      }),
    queryKey: ["place-media", placeId],
    select: (data) => data.allMedia.media,
  });
}
