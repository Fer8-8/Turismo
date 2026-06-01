import { Pressable, StyleSheet, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";
import type { PLAN_IMAGES } from "../constants/states-constants";
import { SavedPlanBadge } from "./saved-plan-badge";
import { SavedPlanCollage } from "./saved-plan-collage";

type PlansCard = {
  text: string;
  numPlaces: number;
  subtitle: string;
  image: keyof typeof PLAN_IMAGES;
  onPress?: () => void;
};

export function SavedPlanCard({
  text,
  subtitle,
  numPlaces,
  image,
  onPress,
}: PlansCard) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View>
          <SavedPlanCollage name={image} />
        </View>
        <View style={styles.content}>
          <View>
            <Text color="title">{text}</Text>
            <Text variant="bodySmall">{subtitle}</Text>
          </View>
          <SavedPlanBadge
            text={numPlaces > 1 ? `${numPlaces} Lugares` : `${numPlaces} Lugar`}
          />
        </View>
      </Card>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
});
