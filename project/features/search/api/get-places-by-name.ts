import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getAllPlacesByNameQuery = graphql(`
  query getAllPlacesByName($name: String) {
    places(name: $name) {
      places {
        id
        name
        category {
          category
        }
      }
    }
  }
`);

export function useGetPlacesByName(name: string) {
  return useQuery({
    queryFn: () => gqlClient.request(getAllPlacesByNameQuery, { name }),
    queryKey: ["places-by-name", name],
    select: (data) => {
      return data.places.places?.map((item) => ({
        ...item,
        category: item.category?.category,
      }));
    },
  });
}
