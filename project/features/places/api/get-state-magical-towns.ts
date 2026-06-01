import { useQuery } from "@tanstack/react-query";
import { useGetCategories } from "@/features/home/api/get-categories";
import { useGetAllStates } from "@/features/search/api/get-all-states";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";
import { normalizeText } from "@/lib/string";

const getMagicalTownsQuery = graphql(`
    query getMagicalTowns($isCover: [Boolean!], $stateId: [String!], $idCategory: [String!]) {
  places(isCover: $isCover, state_id: $stateId, id_category: $idCategory) {
    places {
      id
      name
      medias {
        url
      }
    }
  }
}
  `);

export function useGetStateMagicalTowns(stateName: string) {
  const { data: states } = useGetAllStates();
  const { data: categories } = useGetCategories();

  const state = states?.find(
    (s) => normalizeText(s.name) === normalizeText(stateName)
  );
  const category = categories?.find((c) => c.category === "Pueblo Mágico");

  const magicalTownsQuery = useQuery({
    queryKey: ["magical-towns", state?.id, category?.id_category, stateName],
    queryFn: () =>
      gqlClient.request(getMagicalTownsQuery, {
        isCover: true,
        stateId: state?.id,
        idCategory: category?.id_category,
      }),
    select: (data) => data.places.places,
    enabled: !!state?.id && !!category?.id_category,
  });

  return {
    ...magicalTownsQuery,
    stateDescription: state?.description,
  };
}
