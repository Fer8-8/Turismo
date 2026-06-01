import { useInfiniteQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { useSeed } from "@/hooks/use-seed";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getAllPlacesByCategoryQuery = graphql(`
  query GetAllPlacesByCategory($current: Int, $isCover: [Boolean!], $mimeType: [String!], $isRandom: Boolean, $seed: Int, $idCategory: [String!], $limit: Int) {
  places(current: $current, isCover: $isCover, mime_type: $mimeType, isRandom: $isRandom, seed: $seed, id_category: $idCategory, limit: $limit) {
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

export function useGetAllPlacesByCategory(idCategory?: string, limit?: number) {
  const seed = useSeed();
  return useInfiniteQuery({
    queryKey: ["all-places-by-category", seed, idCategory, limit],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getAllPlacesByCategoryQuery, {
        current: pageParam,
        isCover: true,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isRandom: true,
        seed,
        idCategory,
        limit,
      }),
    getNextPageParam: (lastPage) => lastPage.places.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      places: data.pages.flatMap((page) => page.places.places),
      pageInfo: data.pages.at(-1)?.places.info,
    }),
    enabled: !!idCategory,
  });
}
