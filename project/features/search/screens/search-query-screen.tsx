import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollContainer } from "@/components/scroll-container";
import { useGetAllStates } from "../api/get-all-states";
import { PlaceResults } from "../components/place-results";
import { SearchHeader } from "../components/search-header";
import { StatesResults } from "../components/states-results";

export function SearchQueryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: placesStates } = useGetAllStates();

  return (
    <View style={styles.container}>
      <SearchHeader setSearchQuery={setSearchQuery} />
      <ScrollContainer>
        {/*<SearchCard />*/}
        <StatesResults
          placesStates={placesStates ?? []}
          searchQuery={searchQuery}
        />
        <PlaceResults searchQuery={searchQuery} />
      </ScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
