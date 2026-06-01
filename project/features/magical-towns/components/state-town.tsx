import Octicons from "@expo/vector-icons/Octicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";

type StateTownProps = {
  imageUrl: string;
  title: string;
  onPress?: () => void;
};

export function StateTown({ imageUrl, title, onPress }: StateTownProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <LinearGradient
        colors={[
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0)",
          "rgba(0,0,0,0.2)",
          "rgba(0,0,0,0.8)",
        ]}
        style={styles.overlay}
      >
        <Text color="inverse" style={styles.title}>
          {title}
        </Text>

        <Button onPress={onPress} style={styles.transparentButton}>
          <Octicons color="#fff" name="chevron-right" size={20} />
        </Button>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 210,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: RADIUS.xl,
    borderCurve: "continuous",
  },
  transparentButton: {
    position: "absolute",
    bottom: SPACING.sm,
    right: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderCurve: "continuous",
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.xl,
  },
  title: {
    position: "absolute",
    bottom: SPACING.lg,
    left: SPACING.lg,
  },
});
