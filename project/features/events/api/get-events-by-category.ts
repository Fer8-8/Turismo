import { useQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getEventsByCategoryQuery = graphql(`
  query getEventsByCategory($idCategory: [String!]) {
    events(id_category: $idCategory) {
      events {
        id
        name
        start_date
        end_date
      }
    }
  }
`);

export function useGetEventsByCategory() {
  return useQuery({
    queryKey: ["events-by-category"],
    queryFn: () =>
      gqlClient.request(getEventsByCategoryQuery, {
        idCategory: ["b4bd68f4-df8a-4dc3-a153-24281df819b9"],
      }),

    select: (data) => {
      const now = new Date();
      return data.events.events
        .filter((event) => {
          const eventDate = new Date(event.start_date);
          return eventDate >= now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.start_date).getTime();
          const dateB = new Date(b.start_date).getTime();
          return dateA - dateB;
        });
    },
  });
}
