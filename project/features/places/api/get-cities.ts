import { useQuery } from "@tanstack/react-query";
import { useGetCategories } from "@/features/home/api/get-categories";
import { graphql } from "@/gql";
import type { ValidRegions } from "@/gql/graphql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getCitiesQuery = graphql(`
  query getCities($idCategory: [String!], $regions: [ValidRegions!], $mimeType: [String!], $isCover: [Boolean!], $limit: Int) {
    places(id_category: $idCategory, regions: $regions, mime_type: $mimeType, isCover: $isCover, limit: $limit) {
      places {
        name
        id
        medias {
          url
        }
      }
    }
  }
`);

export function useGetCities(regions: ValidRegions[], limit?: number) {
  const { data: categories } = useGetCategories();

  const citiesCategory = categories?.find(
    (category) => category.category === "Ciudades"
  );

  return useQuery({
    queryFn: () =>
      gqlClient.request(getCitiesQuery, {
        idCategory: citiesCategory?.id_category,
        regions,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        isCover: true,
        limit,
      }),
    queryKey: ["cities", limit, regions],
    select: (data) => data.places.places,
    enabled: !!citiesCategory?.id_category,
  });
}
