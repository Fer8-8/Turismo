import {
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { SPACING } from "@/lib/theme";

type HorizontalScrollProps = {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function HorizontalScroll({
  style,
  contentContainerStyle,
  children,
}: HorizontalScrollProps) {
  return (
    <View style={style}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 0,
  },
});
