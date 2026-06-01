import Octicons from "@expo/vector-icons/Octicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { MEXICO_STATES } from "@/lib/constants";
import { normalizeText, toCamelCaseKey } from "@/lib/string";
import { SPACING } from "@/lib/theme";
import { HighlightedText } from "./highlighted-text";

type StatesResultsProps = {
  searchQuery: string;
  placesStates: {
    id: string;
    name: string;
  }[];
};

export function StatesResults({
  searchQuery,
  placesStates,
}: StatesResultsProps) {
  const router = useRouter();
  const normalizedQuery = normalizeText(searchQuery);

  const searchedPlacesStates = placesStates.filter((state) =>
    normalizeText(state.name).includes(normalizedQuery)
  );

  const magicalTownStates = MEXICO_STATES.filter(
    (state) =>
      normalizeText(state).includes(normalizedQuery) &&
      state !== "Ciudad de México"
  );

  const totalRows = searchedPlacesStates.length + magicalTownStates.length;

  if (!normalizedQuery || totalRows === 0) {
    return null;
  }

  function handleMagicalTown(state: string) {
    router.push({
      pathname: "/home/state/[state]",
      params: { state: toCamelCaseKey(state) },
    });
  }

  function handlePlaceState(stateId: string) {
    router.push({
      pathname: "/home/results",
      params: { stateId },
    });
  }

  let rowIndex = 0;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {searchedPlacesStates.map((state) => {
          const isLast = rowIndex++ === totalRows - 1;
          return (
            <Pressable
              key={`places-${state.id}`}
              onPress={() => handlePlaceState(state.id)}
              style={({ pressed }) => [
                styles.item,
                !isLast && styles.itemDivider,
                pressed && styles.itemPressed,
              ]}
            >
              <Octicons name="location" size={14} style={styles.rowIcon} />
              <Text color="muted" variant="body">
                Lugares en{" "}
              </Text>
              <HighlightedText query={normalizedQuery} word={state.name} />
            </Pressable>
          );
        })}
        {magicalTownStates.map((state) => {
          const isLast = rowIndex++ === totalRows - 1;
          return (
            <Pressable
              key={`magical-town-${state}`}
              onPress={() => handleMagicalTown(state)}
              style={({ pressed }) => [
                styles.item,
                !isLast && styles.itemDivider,
                pressed && styles.itemPressed,
              ]}
              testID={`search-result-magical-town-${state}`}
            >
              <Image
                source={require("../../../assets/images/stamp-icon/reilete.png")}
                style={styles.magicalTownLogo}
              />
              <Text color="muted" variant="body">
                Pueblos mágicos en{" "}
              </Text>
              <HighlightedText query={normalizedQuery} word={state} />
            </Pressable>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },
  card: {
    padding: 0,
    paddingHorizontal: SPACING.md,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  itemPressed: {
    opacity: 0.7,
  },
  magicalTownLogo: {
    width: 14,
    height: 14,
    marginRight: SPACING.xs,
  },
  rowIcon: {
    marginRight: SPACING.xs,
  },
});
