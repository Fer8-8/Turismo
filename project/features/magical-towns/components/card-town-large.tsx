import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";

type CardTownProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
};

export function CardTownLarge({ imageUrl, title, subtitle }: CardTownProps) {
  return (
    <View style={styles.container}>
      <Image
        contentFit="cover"
        source={{ uri: imageUrl }}
        style={styles.image}
      />
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.2)",
          "rgba(0,0,0,0.8)",
        ]}
        style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.lg }]}
      >
        <View style={styles.content}>
          <Text color="inverse">{title}</Text>
          <Text color="inverse-muted" size="small">
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 460,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.lg,
  },
  content: {
    position: "absolute",
    bottom: SPACING.md,
    left: SPACING.md,
  },
});
