import { Image, type ImageProps } from "expo-image";
import { StyleSheet, View, type ViewProps } from "react-native";
import { Text, type ThemedTextProps } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";

export function CardMedia({ style, ...props }: ViewProps) {
  return <View style={[styles.placeCard, style]} {...props} />;
}

type PlaceCardMediaProps = ImageProps & {};
function CardMediaImage({ style, ...props }: PlaceCardMediaProps) {
  return <Image style={[styles.Image, style]} {...props} />;
}

function CardMediaFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.footer, style]} {...props} />;
}

function CardMediaTitle({ color, variant, ...props }: ThemedTextProps) {
  return (
    <Text color={color || "title"} variant={variant || "body"} {...props} />
  );
}

function CardMediaSubtitle({ color, variant, ...props }: ThemedTextProps) {
  return (
    <Text
      color={color || "foreground"}
      variant={variant || "caption"}
      {...props}
    />
  );
}

CardMedia.Image = CardMediaImage;
CardMedia.Footer = CardMediaFooter;
CardMedia.Title = CardMediaTitle;
CardMedia.Subtitle = CardMediaSubtitle;

const styles = StyleSheet.create({
  placeCard: {
    flex: 1,
  },
  Image: {
    width: "100%",
    height: 150,
    borderRadius: RADIUS.xl,
    borderCurve: "continuous",
  },
  footer: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
});
