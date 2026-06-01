import { useInfiniteQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { useSeed } from "@/hooks/use-seed";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getAllPlacesQuery = graphql(`
  query GetAllPlaces($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int) {
  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {
    places {
      id
      name
      state {
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

export function useGetAllPlaces() {
  const seed = useSeed();
  return useInfiniteQuery({
    queryKey: ["all-places", seed],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getAllPlacesQuery, {
        current: pageParam,
        isCover: true,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isRandom: true,
        seed,
      }),
    getNextPageParam: (lastPage) => lastPage.places.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      places: data.pages.flatMap((page) => page.places.places),
      pageInfo: data.pages.at(-1)?.places.info,
    }),
  });
}
