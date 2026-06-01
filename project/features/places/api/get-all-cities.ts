import { useInfiniteQuery } from "@tanstack/react-query";
import { useGetCategories } from "@/features/home/api/get-categories";
import { graphql } from "@/gql";
import type { ValidRegions } from "@/gql/graphql";
import { useSeed } from "@/hooks/use-seed";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getAllCitiesQuery = graphql(`
  query GetAllCities($current: Int, $idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $isRandom: Boolean, $seed: Int) {
    places(current: $current, id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, isRandom: $isRandom, seed: $seed) {
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
      info {
        count
        next
        pages
        prev
      }
    }
  }
`);

export function useGetAllCities(regions: ValidRegions[]) {
  const seed = useSeed();
  const { data: categories } = useGetCategories();

  const citiesCategory = categories?.find(
    (category) => category.category === "Ciudades"
  );

  return useInfiniteQuery({
    queryKey: ["all-cities", seed, regions],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getAllCitiesQuery, {
        current: pageParam,
        idCategory: citiesCategory?.id_category,
        regions,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isCover: true,
        isRandom: true,
        seed,
      }),
    getNextPageParam: (lastPage) => lastPage.places.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      places: data.pages.flatMap((page) => page.places.places),
      pageInfo: data.pages.at(-1)?.places.info,
    }),
    enabled: !!citiesCategory?.id_category,
  });
}
