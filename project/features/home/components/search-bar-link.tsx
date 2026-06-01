import Octicons from "@expo/vector-icons/Octicons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING, THEME } from "@/lib/theme";

export function SearchBarLink() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/home/search")}
      style={styles.container}
      testID="search-bar-link"
    >
      <Card style={styles.card}>
        <Text color="muted">{t("home.search")}</Text>
        <Octicons color={THEME["foreground-muted"]} name="search" size={24} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingHorizontal: SPACING.lg,
  },
  card: {
    height: 54,
    borderRadius: RADIUS.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: SPACING.lg,
    opacity: 1,
  },
});
