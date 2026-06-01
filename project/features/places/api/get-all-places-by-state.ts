import { useInfiniteQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { useSeed } from "@/hooks/use-seed";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getAllPlacesByStateQuery = graphql(`
  query GetAllPlacesByState($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $stateId: [String!]) {
  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, state_id: $stateId) {
    places {
      id
      name
      state {
        id
        name
      }
      medias {
        url
      }
      category {
        category
      }
    }
    info {
      count
      next
      pages
      prev
    }
  }
}
`);

export function useGetAllPlacesByState(stateId: string | null | undefined) {
  const seed = useSeed();
  return useInfiniteQuery({
    queryKey: ["all-places-by-state", seed, stateId],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getAllPlacesByStateQuery, {
        current: pageParam,
        isCover: [true],
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isRandom: true,
        seed,
        stateId: [stateId],
      }),
    getNextPageParam: (lastPage) => lastPage.places.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      places: data.pages.flatMap((page) => page.places.places),
      pageInfo: data.pages.at(-1)?.places.info,
    }),
    enabled: !!stateId,
  });
}
