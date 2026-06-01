import { StyleSheet, View } from "react-native";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedScrollContainer } from "@/components/animated-scroll-container";
import { CultureEventsScreen } from "@/features/events/screens/culture-events-screen";
import { CategoriesSelector } from "@/features/home/components/categories-selector";
import { HomeHeader } from "@/features/home/components/home-header";
import { SearchBarLink } from "@/features/home/components/search-bar-link";
import { CATEGORIES } from "@/features/home/constants/categories";
import { useActiveCategory } from "@/features/home/hooks/use-active-category";
import { CitiesScreen } from "@/features/home/screens/cities-screen";
import { FoodScreen } from "@/features/home/screens/food-screen";
import { HomeFeedScreen } from "@/features/home/screens/home-feed-screen";
import { NatureScreen } from "@/features/home/screens/nature-screen";
import { MagicalTownsHomeScreen } from "@/features/places/screens/magical-towns-home-screen";
import { LAYOUT, SPACING } from "@/lib/theme";

const CATEGORY_SCREENS = {
  home: HomeFeedScreen,
  magicalTowns: MagicalTownsHomeScreen,
  culture: CultureEventsScreen,
  food: FoodScreen,
  nature: NatureScreen,
  cities: CitiesScreen,
} as const;

export default function Home() {
  const { activeCategory, activeTab, setActiveTab, isMounted } =
    useActiveCategory();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={LAYOUT.flex1}>
      <HomeHeader scrollY={scrollY} />
      <AnimatedScrollContainer
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollContent}
      >
        <View style={styles.headerOptions}>
          <SearchBarLink />
          <CategoriesSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={CATEGORIES}
          />
        </View>
        <View style={styles.content}>
          {CATEGORIES.map(({ id }) => {
            if (!isMounted(id)) {
              return null;
            }
            const Screen = CATEGORY_SCREENS[id];
            return (
              <View key={id} style={activeCategory !== id && styles.hidden}>
                <Screen />
              </View>
            );
          })}
        </View>

        <View />
      </AnimatedScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  headerOptions: {
    gap: SPACING.xl,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: SPACING.md,
  },
  content: {
    marginTop: SPACING["4xl"],
  },
  hidden: {
    display: "none",
  },
});
