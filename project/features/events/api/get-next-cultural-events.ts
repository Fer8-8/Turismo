import { useInfiniteQuery } from "@tanstack/react-query";
import { useGetCategories } from "@/features/home/api/get-categories";
import { graphql } from "@/gql";
import { QUERY_IMAGE_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getNextCulturalEventsQuery = graphql(`
  query getNextCulturalEvents($isCover: [Boolean!], $mimeType: [String!], $limit: Int, $current: Int, $startDate: DateTime, $idCategory: [String!]) {
    events(isCover: $isCover, mime_type: $mimeType, limit: $limit, current: $current, start_date: $startDate, id_category: $idCategory) {
      events {
        id
        name
        start_date
        end_date
        state {
          name
        }
        medias {
          url
        }
      }
      info {
        next
        pages
        prev
      }
    }
  }
`);

export function useGetNextCulturalEvents(limit?: number) {
  const { data: categories } = useGetCategories();

  const cultureCategory = categories?.find(
    (category) => category.category === "Cultura"
  );

  return useInfiniteQuery({
    queryKey: ["cultural-events", limit],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getNextCulturalEventsQuery, {
        current: pageParam,
        isCover: true,
        mimeType: QUERY_IMAGE_MIME_TYPES,
        limit,
        startDate: new Date().toISOString(),
        idCategory: cultureCategory?.id_category,
      }),
    getNextPageParam: (lastPage) => lastPage.events.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      events: data.pages
        .flatMap((page) => page.events.events)
        .sort(
          (a, b) =>
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        ),
      pageInfo: data.pages.at(-1)?.events.info,
    }),
    enabled: !!cultureCategory?.id_category,
  });
}
