import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";

type FeedVideoProps = {
  videoTitle: string;
  videoDescription: string;
  placeId: string;
};

export function FeedVideoInfo({
  videoTitle,
  videoDescription,
  placeId,
}: FeedVideoProps) {
  const router = useRouter();

  function handleRedirect() {
    router.push({
      pathname: "/explore/[place]",
      params: { place: placeId },
    });
  }

  return (
    <Pressable onPress={() => handleRedirect()}>
      <Text
        color="inverse"
        fontWeight="700"
        numberOfLines={1}
        style={styles.title}
      >
        {videoTitle}
      </Text>
      <Text color="inverse-muted" numberOfLines={2} style={styles.description}>
        {videoDescription}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    textShadowColor: "rgba(0, 0, 0, 0.70)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  description: {
    marginTop: SPACING.xs,
    textShadowColor: "rgba(0, 0, 0, 0.50)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
});
