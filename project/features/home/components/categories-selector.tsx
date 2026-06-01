import { Image } from "expo-image";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";
import { CATEGORY_ICONS } from "../constants/icons";
import type { Category } from "../types";

type CategoriesSelectorProps = {
  tabs: readonly Category[];
  activeTab: number;
  onTabChange: (tabId: number) => void;
};

export function CategoriesSelector({
  tabs,
  activeTab,
  onTabChange,
}: CategoriesSelectorProps) {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  const indicatorPosition = useSharedValue(SPACING.lg as number);
  const indicatorWidth = useSharedValue(0);

  function handleLayout(index: number, width: number) {
    setTabWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width;

      // Initialize indicator on first tab measurement
      if (index === 0 && indicatorWidth.value === 0) {
        indicatorWidth.value = width;
      }

      return newWidths;
    });
  }

  function handleTabPress(idx: number) {
    onTabChange(idx);

    // Calculate distance of items + gaps
    const itemsDistance = tabWidths
      .slice(0, idx)
      .reduce((sum, width) => sum + width + SPACING.lg, 0);

    // Add the initial container padding to the calculation
    const indicatorX = itemsDistance + SPACING.lg;

    scrollViewRef.current?.scrollTo({
      x: itemsDistance,
      animated: true,
    });

    indicatorPosition.value = withSpring(indicatorX, {
      damping: 20,
      stiffness: 150,
      mass: 1,
    });

    indicatorWidth.value = withSpring(tabWidths[idx] || 0, {
      damping: 15,
      stiffness: 150,
      mass: 1,
    });
  }

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: indicatorPosition.value }],
      width: indicatorWidth.value,
    };
  });

  return (
    <View style={styles.tabContainer}>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={{
          gap: SPACING.lg,
          paddingHorizontal: SPACING.lg,
          paddingBottom: 0,
        }}
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab, idx) => (
          <Pressable
            key={tab.id}
            onLayout={(e) => handleLayout(idx, e.nativeEvent.layout.width)}
            onPress={() => handleTabPress(idx)}
            style={styles.tabItem}
          >
            <Image
              source={CATEGORY_ICONS[tab.icon]}
              style={{ width: 40, height: 40 }}
            />
            <Text
              align="center"
              color={idx === activeTab ? "title" : "foreground"}
              variant="caption"
            >
              {t(`home.categories.${tab.id}`)}
            </Text>
          </Pressable>
        ))}
        <Animated.View
          pointerEvents="none"
          style={[styles.indicator, animatedIndicatorStyle]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: "relative",
    width: "100%",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    paddingBottom: SPACING.xs + 2,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  divider: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#E6E6E6",
  },
});
