import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { TextInput } from "@/components/ui/text-input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { RADIUS, SPACING, THEME } from "@/lib/theme";

type SearchHeaderProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchHeader({ setSearchQuery }: SearchHeaderProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText, 400);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  function handleGoBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <FixedHeaderLayout>
      <View style={styles.container}>
        <TextInput
          autoFocus={true}
          onChangeText={setSearchText}
          placeholder={t("home.search")}
          style={styles.input}
          testID="search-input"
          value={searchText}
        />

        <Pressable hitSlop={8} onPress={handleGoBack} style={styles.backButton}>
          <Octicons
            color={THEME["foreground-muted"]}
            name="chevron-left"
            size={20}
          />
        </Pressable>

        <Pressable
          hitSlop={8}
          onPress={() => setSearchText("")}
          style={styles.clearSearchButton}
          testID="clear-search-input"
        >
          <Octicons color={THEME["foreground-muted"]} name="x" size={20} />
        </Pressable>
      </View>
    </FixedHeaderLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    width: "100%",
    height: 20,
  },
  input: {
    height: 42,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING["4xl"],
    flex: 1,
    width: "auto",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: SPACING.sm,
  },
  clearSearchButton: {
    position: "absolute",
    top: 0,
    right: SPACING.sm,
  },
});
