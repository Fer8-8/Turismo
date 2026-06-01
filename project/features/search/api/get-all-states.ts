import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getAllStatesQuery = graphql(`
  query getAllStates {
      states {
        id
        name
        description
      }
  }
`);

export function useGetAllStates() {
  return useQuery({
    queryKey: ["all-states"],
    queryFn: () => gqlClient.request(getAllStatesQuery),
    select: (data) => data.states,
  });
}
