import { Image, type ImageProps } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, type ViewProps } from "react-native";
import { Text, type ThemedTextProps } from "@/components/ui/text";
import { FONT, RADIUS, SPACING, THEME } from "@/lib/theme";

export function CardFeatured({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

function CardFeaturedImage({ style, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.lg }, style]}
    />
  );
}

function CardFeaturedOverlay() {
  return (
    <LinearGradient
      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]}
      style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.lg }]}
    />
  );
}

type NumberProps = {
  number: number;
};
function CardFeaturedBadge({ number }: NumberProps) {
  return (
    <View style={styles.containerBadge}>
      <View style={styles.badge}>
        <Text style={styles.textBadge}>{number}</Text>
      </View>
      <View style={styles.contentTriangle}>
        <View style={styles.triangle} />
        <View style={styles.triangle2} />
      </View>
    </View>
  );
}

function CardFeaturedContent({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.contentText, style]} />;
}

function CardFeaturedTitle({ color, ...props }: ThemedTextProps) {
  return <Text color={color || "inverse"} {...props} />;
}

function CardFeaturedSubtitle({ color, variant, ...props }: ThemedTextProps) {
  return (
    <Text
      color={color || "inverse-muted"}
      variant={variant || "caption"}
      {...props}
    />
  );
}

CardFeatured.Image = CardFeaturedImage;
CardFeatured.Overlay = CardFeaturedOverlay;
CardFeatured.Badge = CardFeaturedBadge;
CardFeatured.Content = CardFeaturedContent;
CardFeatured.Title = CardFeaturedTitle;
CardFeatured.Subtitle = CardFeaturedSubtitle;

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 200,
    borderRadius: RADIUS.lg,
  },
  containerBadge: {
    position: "absolute",
    top: 0,
    left: 24,
    alignItems: "center",
  },
  badge: {
    width: 24,
    height: 38,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  textBadge: {
    color: THEME["primary-foreground"],
    fontSize: FONT.subtitle,
    top: 2,
  },
  contentTriangle: {
    position: "absolute",
    justifyContent: "space-between",
    flexDirection: "row",
    top: 38,
  },
  triangle: {
    borderRightWidth: 11.9,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "black",
  },
  triangle2: {
    borderLeftWidth: 12,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "black",
  },
  contentText: {
    position: "absolute",
    bottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
});
