import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";
import { useGetPlaceMedia } from "../../api/get-place-media";
import { PlaceDetailsGalleryItem } from "./place-details-gallery-item";

const HEIGHTS = [180, 240, 150, 210, 170, 130];

export function PlaceDetailsGallery({ placeId }: { placeId: string }) {
  const { data } = useGetPlaceMedia(placeId);

  if (!data || data.length === 0) {
    return null;
  }

  const firstHalf = data.slice(0, Math.ceil(data.length / 2));
  const secondHalf = data.slice(Math.ceil(data.length / 2));

  return (
    <View>
      <Text style={styels.title}>Fotos</Text>
      <View style={styels.row}>
        <View style={styels.item}>
          {firstHalf.map((media, index) => (
            <PlaceDetailsGalleryItem
              imageHeight={HEIGHTS[index % HEIGHTS.length]}
              imageUrl={media.url}
              key={media.id}
            />
          ))}
        </View>
        <View style={styels.item}>
          {secondHalf.map((media, index) => (
            <PlaceDetailsGalleryItem
              imageHeight={HEIGHTS[(index + 2) % HEIGHTS.length]}
              imageUrl={media.url}
              key={media.id}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styels = StyleSheet.create({
  title: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  item: {
    flex: 1,
    gap: SPACING.sm,
  },
});
