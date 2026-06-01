import { CardFeatured } from "@/components/ui/card-feature";

type OfficialGuidesItemProps = {
  imageUrl: string;
  title: string;
  subtitle: string;
};
export function OfficialGuidesItem({
  imageUrl,
  title,
  subtitle,
}: OfficialGuidesItemProps) {
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
