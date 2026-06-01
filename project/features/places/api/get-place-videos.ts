import { useInfiniteQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { gqlClient } from "@/lib/graphql-client";

const getPlaceVideosQuery = graphql(`
  query GetPlaceVideos($placeId: [String!], $current: Int) {
    allMedia(place_id: $placeId, current: $current) {
      media {
        id
        mime_type
        url
        miniature_url
        stream_url
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

export function useGetPlaceVideos(placeId: string) {
  return useInfiniteQuery({
    queryKey: ["place-videos", placeId],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getPlaceVideosQuery, { placeId, current: pageParam }),
    getNextPageParam: (lastPage) => lastPage.allMedia.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      // Flatten all pages into a single array, filtering for videos only
      media: data.pages.flatMap((page) =>
        page.allMedia.media.filter((m) => m.mime_type === "video/mp4")
      ),
      pageInfo: data.pages.at(-1)?.allMedia.info,
    }),
  });
}
