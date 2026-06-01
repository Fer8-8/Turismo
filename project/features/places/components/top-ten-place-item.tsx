import { Pressable } from "react-native";
import { CardFeatured } from "@/components/ui/card-feature";

type TopTenPlaceItemProps = {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  position: number;
  onPress?: () => void;
};
export function TopTenPlaceItem({
  imageUrl,
  title,
  subtitle,
  position,
  onPress,
}: TopTenPlaceItemProps) {
  return (
    <Pressable onPress={onPress}>
      <CardFeatured>
        <CardFeatured.Image source={{ uri: imageUrl }} />
        <CardFeatured.Overlay />
        <CardFeatured.Badge number={position} />
        <CardFeatured.Content>
          <CardFeatured.Title numberOfLines={1}>{title}</CardFeatured.Title>
          <CardFeatured.Subtitle>{subtitle}</CardFeatured.Subtitle>
        </CardFeatured.Content>
      </CardFeatured>
    </Pressable>
  );
}
