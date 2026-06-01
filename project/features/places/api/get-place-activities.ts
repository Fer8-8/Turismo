import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getPlaceActivitiesQuery = graphql(`
  query PlaceActivitiesByPlaceId($placeId: ID!, $current: Int, $mimeType: [String!], $isCover: [Boolean!]) {
    placeActivitiesByPlaceId(placeId: $placeId, current: $current, mime_type: $mimeType, isCover: $isCover) {
      info {
        next
        pages
        prev
      }
      placeActivities {
        id
        activity_name
        difficulty_level
        additional_cost
        requires_equipment
        min_age
        available_months
        place_id
        media {
          url
        }
      }
    }
  }
`);

export function useGetPlaceActivities(placeId: string) {
  return useQuery({
    queryKey: ["place-activities", placeId],
    queryFn: () =>
      gqlClient.request(getPlaceActivitiesQuery, {
        placeId,
        current: 1,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isCover: [true],
      }),
    select: (data) => data.placeActivitiesByPlaceId.placeActivities,
    enabled: !!placeId,
  });
}
