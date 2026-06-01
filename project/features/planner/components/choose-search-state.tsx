import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { TextInput } from "@/components/ui/text-input";
import { SPACING, THEME } from "@/lib/theme";

type ChosseSearchStateProps = {
  value: string;
  setValue: (value: string) => void;
};

export function ChosseSearchState({ value, setValue }: ChosseSearchStateProps) {
  const router = useRouter();

  function handleRedirect() {
    if (router.canGoBack()) {
      router.back();
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChange={(e) => {
          setValue(e.nativeEvent.text);
        }}
        placeholder="Buscar un lugar"
        style={styles.input}
        value={value}
      />
      <Pressable hitSlop={8} onPress={handleRedirect} style={styles.backButton}>
        <Octicons
          color={THEME["foreground-muted"]}
          name="chevron-left"
          size={24}
        />
      </Pressable>
      <Pressable
        hitSlop={8}
        onPress={() => setValue("")}
        style={styles.searchIcon}
      >
        <Octicons color={THEME["foreground-muted"]} name="x" size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingHorizontal: SPACING.lg,
  },
  input: {
    paddingHorizontal: SPACING["5xl"],
  },
  searchIcon: {
    position: "absolute",
    top: 15,
    right: SPACING["3xl"],
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: SPACING["3xl"],
  },
});
