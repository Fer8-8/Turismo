import { CardMedia } from "@/components/ui/card-media";

type TopCulturalPlacesitemProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export default function TopCulturalPlacesitem({
  title,
  subtitle,
  imageUrl,
}: TopCulturalPlacesitemProps) {
  return (
    <CardMedia>
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
