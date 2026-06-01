import type { ViewStyle } from "react-native";
import { CardMedia } from "@/components/ui/card-media";

type PopularPlaceGridItemProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
  style?: ViewStyle;
};

export default function PopularPlaceGridItem({
  title,
  subtitle,
  imageUrl,
  style,
}: PopularPlaceGridItemProps) {
  return (
    <CardMedia style={style}>
      <CardMedia.Image
        source={{
          uri: imageUrl,
        }}
      />
      <CardMedia.Footer>
        <CardMedia.Title numberOfLines={1}>{title}</CardMedia.Title>
        <CardMedia.Subtitle>{subtitle}</CardMedia.Subtitle>
      </CardMedia.Footer>
    </CardMedia>
  );
}
