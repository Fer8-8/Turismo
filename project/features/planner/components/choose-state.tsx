import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useGetAllStates } from "@/features/search/api/get-all-states";
import { NAVIGATION_HEIGTH, SPACING } from "@/lib/theme";
import { usePlannerStore } from "../store/planner-store";
import { ChosseSearchState } from "./choose-search-state";

export default function ChooseState() {
  const { data: states, isLoading } = useGetAllStates();
  const { selectedStateId, setSelectedState } = usePlannerStore();
  const [search, setSearch] = useState("");

  const filteredStates = useMemo(() => {
    if (!states) {
      return [];
    }
    return states.filter((state) =>
      state.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [states, search]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <ChosseSearchState setValue={setSearch} value={search} />
      </SafeAreaView>

      {isLoading && <ActivityIndicator style={styles.loader} />}

      {!isLoading && filteredStates.length === 0 && search !== "" && (
        <Text align="center" color="inverse" variant="subtitle">
          Sin resultados
        </Text>
      )}

      <FlashList
        contentContainerStyle={{
          paddingBottom: NAVIGATION_HEIGTH + 200,
          paddingHorizontal: SPACING.lg,
        }}
        data={filteredStates}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            hitSlop={8}
            onPress={() => setSelectedState(item.id, item.name)}
          >
            <Text
              color="inverse"
              style={[selectedStateId === item.id && styles.selectedText]}
              variant="subtitle"
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING.lg,
  },
  loader: {
    marginTop: SPACING["3xl"],
  },
  selectedText: {
    color: "#000000",
  },
  separator: {
    marginVertical: SPACING.md,
  },
});
