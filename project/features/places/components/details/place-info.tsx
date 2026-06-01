import { StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";

type PlaceInfoProps = {
  name: string;
  description: string;
  category: string;
};

export function PlaceInfo({ name, description, category }: PlaceInfoProps) {
  return (
    <>
      <Text variant="title">{name}</Text>
      <Text color="muted" variant="bodySmall">
        {category}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  description: {
    marginTop: SPACING.md,
  },
});
