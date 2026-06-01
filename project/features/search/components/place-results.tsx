import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { normalizeText } from "@/lib/string";
import { SPACING } from "@/lib/theme";
import { useGetPlacesByName } from "../api/get-places-by-name";
import { HighlightedText } from "./highlighted-text";

type PlaceResultsProps = {
  searchQuery: string;
};

export function PlaceResults({ searchQuery }: PlaceResultsProps) {
  const router = useRouter();
  const normalizedQuery = normalizeText(searchQuery);
  const { data: places } = useGetPlacesByName(normalizedQuery);

  if (!(normalizedQuery && places?.length)) {
    return null;
  }

  function handlePlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {places.map((place, index) => (
          <Pressable
            key={place.id}
            onPress={() => handlePlace(place.id)}
            style={({ pressed }) => [
              styles.item,
              index < places.length - 1 && styles.itemDivider,
              pressed && styles.itemPressed,
            ]}
          >
            <HighlightedText query={normalizedQuery} word={place.name} />
            <Text color="muted" variant="caption">
              {place.category}
            </Text>
          </Pressable>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
  },
  card: {
    padding: 0,
    paddingHorizontal: SPACING.md,
  },
  item: {
    paddingVertical: SPACING.md,
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  itemPressed: {
    opacity: 0.7,
  },
});
