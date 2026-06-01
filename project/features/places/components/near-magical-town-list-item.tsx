import { StyleSheet, View } from "react-native";
import { CardRow } from "@/components/ui/card-row";
import { SPACING } from "@/lib/theme";

type NearMagicalTownListItemProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
  badges: string[];
};

export function NearMagicalTownListItem({
  imageUrl,
  title,
  subtitle,
  badges,
}: NearMagicalTownListItemProps) {
  return (
    <CardRow>
      <CardRow.Image source={{ uri: imageUrl }} />
      <CardRow.Content>
        <View>
          <CardRow.Title>{title}</CardRow.Title>
          <CardRow.Subtitle>{subtitle}</CardRow.Subtitle>
        </View>

        <View style={styles.badgeContainer}>
          {badges?.map((badge) => (
            <CardRow.Badge key={badge}>{badge}</CardRow.Badge>
          ))}
        </View>
      </CardRow.Content>
    </CardRow>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: SPACING.xs,
  },
});
