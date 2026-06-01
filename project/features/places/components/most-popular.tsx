import { CardMedia } from "@/components/ui/card-media";

type MostPopularProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
};

export function MostPopular({ imageUrl, title, subtitle }: MostPopularProps) {
  return (
    <CardMedia>
      <CardMedia.Image source={imageUrl} />
      <CardMedia.Footer>
        <CardMedia.Title numberOfLines={1}>{title}</CardMedia.Title>
        <CardMedia.Subtitle>{subtitle}</CardMedia.Subtitle>
      </CardMedia.Footer>
    </CardMedia>
  );
}
