import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";

type CardTownProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
};

export function CardTown({ imageUrl, title, subtitle }: CardTownProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <Text color="title" style={{ marginLeft: SPACING.xs }}>
        {title}
      </Text>
      <Text size="small" style={{ marginLeft: SPACING.xs }}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: RADIUS.lg,
    marginBottom: 8,
  },
});
