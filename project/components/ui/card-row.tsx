import { Image, type ImageProps } from "expo-image";
import { StyleSheet, View, type ViewProps } from "react-native";
import { Card } from "@/components/ui/card";
import { Text, type ThemedTextProps } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";

export function CardRow({ children, style, ...props }: ViewProps) {
  return (
    <Card style={[styles.cardPlace, style]} {...props}>
      {children}
    </Card>
  );
}

function CardRowContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />;
}

function CardRowImage({ style, ...props }: ImageProps) {
  return <Image {...props} style={[styles.cardImage, style]} />;
}

function CardRowTitle({ color, variant, ...props }: ThemedTextProps) {
  return (
    <Text color={color || "title"} variant={variant || "body"} {...props} />
  );
}

function CardRowSubtitle({ color, variant, ...props }: ThemedTextProps) {
  return (
    <Text
      color={color || "muted"}
      variant={variant || "bodySmall"}
      {...props}
    />
  );
}

function CardRowBadge({ color, variant, ...props }: ThemedTextProps) {
  return (
    <View style={styles.BadgeCard}>
      <Text
        color={color || "muted"}
        variant={variant || "caption"}
        {...props}
      />
    </View>
  );
}

function CardRowIcon({ style, ...props }: ImageProps) {
  return <Image {...props} style={[styles.cardIcon, style]} />;
}

CardRow.Image = CardRowImage;
CardRow.Content = CardRowContent;
CardRow.Title = CardRowTitle;
CardRow.Subtitle = CardRowSubtitle;
CardRow.Badge = CardRowBadge;
CardRow.Icon = CardRowIcon;

const styles = StyleSheet.create({
  cardPlace: {
    width: "100%",
    height: 94,
    borderRadius: RADIUS.xl,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: "space-between",
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.md,
  },
  BadgeCard: {
    backgroundColor: "#8A8A8A0D",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  cardIcon: {
    borderRadius: RADIUS.md,
    borderCurve: "continuous",
    width: 50,
    height: 50,
  },
});
