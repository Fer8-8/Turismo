import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { RADIUS } from "@/lib/theme";
import { PLAN_IMAGES } from "../constants/states-constants";

type PlanImage = {
  name: keyof typeof PLAN_IMAGES;
};

export function SavedPlanCollage({ name }: PlanImage) {
  return (
    <View style={styles.container}>
      <Image
        contentFit="cover"
        source={{ uri: PLAN_IMAGES[name] }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
