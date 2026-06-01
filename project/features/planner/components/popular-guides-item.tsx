import { CardFeatured } from "@/components/ui/card-feature";

type PopularGuidesItemProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
};
export function PopularGuidesItem({
  imageUrl,
  title,
  subtitle,
}: PopularGuidesItemProps) {
  return (
    <CardFeatured>
      <CardFeatured.Image source={{ uri: imageUrl }} />
      <CardFeatured.Overlay />
      <CardFeatured.Content>
        <CardFeatured.Title numberOfLines={1}>{title}</CardFeatured.Title>
        <CardFeatured.Subtitle>{subtitle}</CardFeatured.Subtitle>
      </CardFeatured.Content>
    </CardFeatured>
  );
}
