import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getAllEventsByPlacesQuery = graphql(`
  query GetAllEventsByPlaces($startDate: DateTime) {
    events(start_date: $startDate) {
      events {
        id
        name
        start_date
        end_date
        state {
          name
        }
        category {
          category
        }
      }
    }
  }
`);

export function useAllEventsByPlacesQuery(startDate: string) {
  return useQuery({
    queryKey: ["events", startDate],
    queryFn: async () => {
      const data = await gqlClient.request(getAllEventsByPlacesQuery, {
        startDate,
      });

      return data;
    },

    select: (data) => data?.events?.events ?? [],
  });
}
