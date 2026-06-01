import type { ViewStyle } from "react-native";
import { CardFeatured } from "@/components/ui/card-feature";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";

type CitiesItemProps = {
  city: string;
  imageUrl?: string;
  style?: ViewStyle;
};

export function CitiesItem({ city, imageUrl, style }: CitiesItemProps) {
  return (
    <CardFeatured style={[{ width: undefined }, style]}>
      <CardFeatured.Image source={{ uri: imageUrl ?? IMAGE_PLACEHOLDER }} />
      <CardFeatured.Overlay />
      <CardFeatured.Content>
        <CardFeatured.Title numberOfLines={1}>{city}</CardFeatured.Title>
      </CardFeatured.Content>
    </CardFeatured>
  );
}
