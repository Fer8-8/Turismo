import { useInfiniteQuery } from "@tanstack/react-query";
import { graphql } from "@/gql";
import { useSeed } from "@/hooks/use-seed";
import { QUERY_VIDEO_MIME_TYPES } from "@/lib/constants";
import { gqlClient } from "@/lib/graphql-client";

const getFeedVideosQuery = graphql(`
  query GetFeedVideos($current: Int, $mimeType: [String!], $isRandom: Boolean, $seed: Int) {
    allMedia(current: $current, mime_type: $mimeType, isRandom: $isRandom, seed: $seed) {
      media {
        url
        id
        miniature_url
        stream_url
        place {
          id
          name
          description
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

export function useGetFeedVideos() {
  const seed = useSeed();

  return useInfiniteQuery({
    queryKey: ["feed-videos", seed],
    queryFn: ({ pageParam = 1 }) =>
      gqlClient.request(getFeedVideosQuery, {
        current: pageParam,
        mimeType: QUERY_VIDEO_MIME_TYPES,
        isRandom: true,
        seed,
      }),
    getNextPageParam: (lastPage) => lastPage.allMedia.info.next ?? undefined,
    initialPageParam: 1,
    select: (data) => ({
      // Flatten all pages into a single array
      media: data.pages.flatMap((page) => page.allMedia.media),
      pageInfo: data.pages.at(-1)?.allMedia.info,
    }),
  });
}
