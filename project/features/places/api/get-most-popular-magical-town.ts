import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getMostPopularMagicalTownQuery = graphql(`
  query getMostPopularMagicalTown($idCategory: [String!], $limit: Int, $isCover: [Boolean!]) {
    places(id_category: $idCategory, limit: $limit, isCover: $isCover) {
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

export function useGetMostPopularMagicalTown() {
  return useQuery({
    queryKey: ["most-popular-magical-town"],
    queryFn: () =>
      gqlClient.request(getMostPopularMagicalTownQuery, {
        limit: 10,
        isCover: true,
        idCategory: "08eb27cc-654b-5871-a198-7e785f77b4fd",
      }),
    select: (data) => data.places.places,
  });
}
