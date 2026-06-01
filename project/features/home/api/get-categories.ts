import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getCategoriesQuery = graphql(`
  query getCategories {
    categories {
      id_category
      category
    }
  }
`);

export function useGetCategories() {
  return useQuery({
    queryFn: () => gqlClient.request(getCategoriesQuery),
    queryKey: ["categories"],
    select: (data) => data.categories,
  });
}
