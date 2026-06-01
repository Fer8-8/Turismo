import { Pressable } from "react-native";
import { CardFeatured } from "@/components/ui/card-feature";

type MostPopularMagicalTownItemProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
};
export function MostPopularMagicalTownItem({
  imageUrl,
  title,
  subtitle,
  onPress,
}: MostPopularMagicalTownItemProps) {
  return (
    <Pressable onPress={onPress}>
      <CardFeatured>
        <CardFeatured.Image source={{ uri: imageUrl }} />
        <CardFeatured.Overlay />
        <CardFeatured.Content>
          <CardFeatured.Title numberOfLines={1}>{title}</CardFeatured.Title>
          <CardFeatured.Subtitle>{subtitle}</CardFeatured.Subtitle>
        </CardFeatured.Content>
      </CardFeatured>
    </Pressable>
  );
}
