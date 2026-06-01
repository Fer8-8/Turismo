import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";
import type { Origin } from "../types";
import { StoryVideoPlayer } from "./story-video-player";

type EventStoriesItemProps = {
  ringColor?: string;
};

export function EventStoriesItem({ ringColor }: EventStoriesItemProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const thumbnailRef = useRef<View>(null);

  function handlePress() {
    thumbnailRef.current?.measureInWindow((x, y, width, height) => {
      setOrigin({ x, y, width, height });
      setIsVideoOpen(true);
    });
  }

  return (
    <>
      <View style={styles.story}>
        <Pressable
          onPress={handlePress}
          style={[styles.thumbnailRing, { borderColor: ringColor }]}
        >
          <View ref={thumbnailRef} style={styles.thumbnailContainer}>
            <Image
              source={{
                uri: "https://customer-nezp2m3kttawhwjf.cloudflarestream.com/7e20d027aeef61bcc5ff193c8c194200/thumbnails/thumbnail.jpg",
              }}
              style={styles.thumbnails}
            />
            <View style={styles.overlay}>
              <Ionicons color="white" name="play" size={22} />
            </View>
          </View>
        </Pressable>

        <View>
          <Text align="center" color="title" variant="bodySmall">
            Día de Muertos
          </Text>
          <Text align="center" variant="caption">
            Michoacán
          </Text>
        </View>
      </View>

      {isVideoOpen ? (
        <StoryVideoPlayer
          onClose={() => setIsVideoOpen(false)}
          origin={origin}
          thumbnailUrl="https://customer-nezp2m3kttawhwjf.cloudflarestream.com/7e20d027aeef61bcc5ff193c8c194200/thumbnails/thumbnail.jpg"
          videoUrl="https://customer-nezp2m3kttawhwjf.cloudflarestream.com/7e20d027aeef61bcc5ff193c8c194200/manifest/video.m3u8"
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  story: {
    alignItems: "center",
    gap: SPACING.sm,
  },
  thumbnailRing: {
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: "#ff0000",
    padding: 2,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  thumbnails: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
});
