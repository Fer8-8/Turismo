import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
} from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { RADIUS } from "@/lib/theme";

type ExploreProps = {
  icon?: ImageSourcePropType;
  title?: string;
  onPress?: () => void;
};
export function ExporeInterestsItem({ icon, title, onPress }: ExploreProps) {
  return (
    <Pressable onPress={onPress} style={styles.content}>
      <Card style={styles.card}>
        <Image source={icon} style={styles.image} />
        <Text numberOfLines={1} variant="bodySmall">
          {title}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    aspectRatio: 1,
  },
  card: {
    flex: 1,
    borderRadius: RADIUS.sm,
    justifyContent: "space-around",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: 55,
    height: 55,
  },
});
