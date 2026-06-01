import { Image } from "expo-image";
import { StyleSheet, View, type ViewProps } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";

type HotelPreviewProps = ViewProps & {};

function HotelPreview({ style, ...rest }: HotelPreviewProps) {
  return <View style={[styles.hotelPreview, style]} {...rest} />;
}

type HotelImageProps = {
  imageUrl: string;
  aspectRatio?: number;
};

function HotelImage({ imageUrl, aspectRatio = 250 / 172 }: HotelImageProps) {
  return (
    <Image
      contentFit="cover"
      source={imageUrl}
      style={[styles.hotelImage, aspectRatio ? { aspectRatio } : {}]}
    />
  );
}

type HotelContentProps = ViewProps & {};

function HotelContent({ style, ...rest }: HotelContentProps) {
  return <View style={[styles.hotelContent, style]} {...rest} />;
}

type HotelHeaderProps = ViewProps & {};

function HotelHeader({ style, ...rest }: HotelHeaderProps) {
  return <View style={[styles.hotelHeader, style]} {...rest} />;
}

type HotelTitleProps = {
  children: string;
};

function HotelTitle({ children }: HotelTitleProps) {
  return (
    <Text fontWeight="600" numberOfLines={1}>
      {children}
    </Text>
  );
}

// Location
type HotelLocationProps = {
  children: string;
};

function HotelLocation({ children }: HotelLocationProps) {
  return (
    <Text color="muted" numberOfLines={1} size="small">
      {children}
    </Text>
  );
}

type HotelRatingProps = {
  rating: number;
  reviewCount?: number;
};

function HotelRating({ rating, reviewCount }: HotelRatingProps) {
  return (
    <View style={styles.hotelRating}>
      <Text fontWeight="600" size="small">
        ★ {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text color="muted" size="small">
          ({reviewCount})
        </Text>
      )}
    </View>
  );
}

type HotelFooterProps = ViewProps & {};

function HotelFooter({ style, ...rest }: HotelFooterProps) {
  return <View style={[styles.hotelFooter, style]} {...rest} />;
}

// Price
type HotelPriceProps = {
  amount: string | number;
  currency?: string;
  period?: string;
  discounted?: boolean;
};

function HotelPrice({
  amount,
  currency = "$",
  period = "/noche",
  discounted = false,
}: HotelPriceProps) {
  return (
    <View style={styles.hotelPriceAmount}>
      <Text
        fontWeight="700"
        size="large"
        style={discounted && styles.discountedPrice}
      >
        {currency}
        {amount}
      </Text>
      <Text color="muted" size="small">
        {period}
      </Text>
    </View>
  );
}

type HotelOriginalPriceProps = {
  amount: string | number;
  currency?: string;
};

function HotelOriginalPrice({
  amount,
  currency = "$",
}: HotelOriginalPriceProps) {
  return (
    <Text color="muted" size="small" style={styles.originalPrice}>
      {currency}
      {amount}
    </Text>
  );
}

type HotelBadgeProps = {
  children: string;
  variant?: "default" | "success" | "warning";
};

function HotelBadge({ children, variant = "default" }: HotelBadgeProps) {
  return (
    <View
      style={[
        styles.hotelBadge,
        variant === "success" && styles.hotelBadgeSuccess,
        variant === "warning" && styles.hotelBadgeWarning,
      ]}
    >
      <Text fontWeight="600" size="small">
        {children}
      </Text>
    </View>
  );
}

type HotelBadgesProps = ViewProps & {};

function HotelBadges({ style, ...rest }: HotelBadgesProps) {
  return <View style={[styles.hotelBadges, style]} {...rest} />;
}

export {
  HotelPreview,
  HotelImage,
  HotelContent,
  HotelHeader,
  HotelTitle,
  HotelLocation,
  HotelRating,
  HotelFooter,
  HotelPrice,
  HotelOriginalPrice,
  HotelBadge,
  HotelBadges,
};

const styles = StyleSheet.create({
  hotelPreview: {
    gap: SPACING.xs,
    backgroundColor: THEME.card,
    alignSelf: "flex-start",
    borderRadius: SPACING.lg,
  },
  hotelImage: {
    width: 250,
    height: 172,
    borderTopLeftRadius: SPACING.lg,
    borderTopRightRadius: SPACING.lg,
  },
  hotelContent: {
    gap: SPACING.sm,
    padding: SPACING.sm,
  },
  hotelHeader: {
    gap: 2,
  },
  hotelRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  hotelFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  hotelPriceAmount: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: SPACING.xs,
  },
  discountedPrice: {
    color: "#DC2626",
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
  hotelBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  hotelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: THEME.background,
    borderRadius: SPACING.xs,
  },
  hotelBadgeSuccess: {
    backgroundColor: "#DCFCE7",
  },
  hotelBadgeWarning: {
    backgroundColor: "#FEF3C7",
  },
});
