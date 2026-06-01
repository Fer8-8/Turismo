import { Pressable, StyleSheet, View } from "react-native";
import { CardRow } from "@/components/ui/card-row";
import { SPACING } from "@/lib/theme";

type CardPlaceProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
  badges?: string[];
  onPress: () => void;
};

export function PlaceListItem({
  imageUrl,
  title,
  subtitle,
  badges,
  onPress,
}: CardPlaceProps) {
  return (
    <Pressable onPress={onPress}>
      <CardRow>
        <CardRow.Image source={{ uri: imageUrl }} />
        <CardRow.Content>
          <View>
            <CardRow.Title>{title}</CardRow.Title>
            <CardRow.Subtitle>{subtitle}</CardRow.Subtitle>
          </View>

          <View style={styles.badgesContainer}>
            {badges?.map((badge) => (
              <CardRow.Badge key={badge}>{badge}</CardRow.Badge>
            ))}
          </View>
        </CardRow.Content>
      </CardRow>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badgesContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: SPACING.xs,
  },
});
