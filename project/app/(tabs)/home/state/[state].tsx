import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedScrollContainer } from "@/components/animated-scroll-container";
import { FixedHeaderLayout } from "@/components/layout/fixed-header-layout";
import { ScreenHeader } from "@/components/layout/screen-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Stamp } from "@/features/magical-towns/components/stamp";
import { StateTown } from "@/features/magical-towns/components/state-town";
import { MEXICO_STATES } from "@/features/magical-towns/constants/mexico-states";
import { useGetStateMagicalTowns } from "@/features/places/api/get-state-magical-towns";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { LAYOUT, SPACING, THEME } from "@/lib/theme";

export default function TownStateScreen() {
  const { state } = useLocalSearchParams<{
    state: keyof typeof MEXICO_STATES;
  }>();
  const stateInfo = MEXICO_STATES[state as keyof typeof MEXICO_STATES];

  const { data, isLoading, stateDescription } = useGetStateMagicalTowns(
    stateInfo.title
  );
  const router = useRouter();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!stateInfo) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={LAYOUT.flex1}>
        <Skeleton style={{ height: 200, marginBottom: SPACING.lg }} />
        <Skeleton style={{ height: 200, marginBottom: SPACING.lg }} />
        <Skeleton style={{ height: 200, marginBottom: SPACING.lg }} />
      </View>
    );
  }

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }
  return (
    <View style={LAYOUT.flex1}>
      <FixedHeaderLayout
        backgroundColor={stateInfo.color}
        scrolledBackgroundColor={THEME.surface}
        scrollThreshold={[0, 240, 300]}
        scrollY={scrollY}
      >
        <ScreenHeader
          scrollThreshold={[0, 280, 290]}
          scrollY={scrollY}
          titleKey={stateInfo.title}
        />
      </FixedHeaderLayout>
      <AnimatedScrollContainer
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.content}
      >
        <View
          style={[
            styles.stateColor,
            {
              backgroundColor: stateInfo.color,
            },
          ]}
        />

        <View style={[styles.container, { backgroundColor: stateInfo.color }]}>
          <LinearGradient
            colors={[
              "rgba(245,245,245,0.00)",
              "rgba(245,245,245,0.01)",
              "rgba(245,245,245,0.04)",
              "rgba(245,245,245,0.09)",
              "rgba(245,245,245,0.16)",
              "rgba(245,245,245,0.26)",
              "rgba(245,245,245,0.37)",
              "rgba(245,245,245,0.50)",
              "rgba(245,245,245,0.63)",
              "rgba(245,245,245,0.74)",
              "rgba(245,245,245,0.84)",
              "rgba(245,245,245,0.91)",
              "rgba(245,245,245,0.96)",
              "rgba(245,245,245,0.99)",
              "#F5F5F5",
            ]}
            end={{ x: 0, y: 1 }}
            locations={[
              0.7048, 0.7254, 0.7461, 0.7668, 0.7904, 0.811, 0.8317, 0.8524,
              0.873, 0.8937, 0.9144, 0.938, 0.9587, 0.9793, 1,
            ]}
            start={{ x: 0, y: 0 }}
            style={LAYOUT.fill}
          />
          <View>
            <View style={styles.center}>
              <Stamp color={stateInfo.color} iconName={state} />
            </View>
            <View style={styles.right}>
              <Stamp color={stateInfo.color} iconName="ave" />
            </View>
            <View style={styles.left}>
              <Stamp color={stateInfo.color} iconName="rueda" />
            </View>
          </View>

          <Text
            align="center"
            style={{ textAlign: "center", marginTop: SPACING["2xl"] }}
            testID={`state-title-${state}`}
            variant="title"
          >
            {stateInfo.title}
          </Text>
        </View>

        <View style={{ paddingHorizontal: SPACING.lg }}>
          <Text style={{ marginTop: SPACING.lg, marginBottom: SPACING.xl }}>
            {stateDescription}
          </Text>

          <View style={{ gap: SPACING.sm }}>
            {data?.map((item) => (
              <StateTown
                imageUrl={item.medias?.[0]?.url ?? IMAGE_PLACEHOLDER}
                key={item.name}
                onPress={() => navigateToPlace(item.id)}
                title={item.name}
              />
            ))}
          </View>
        </View>
      </AnimatedScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    paddingBottom: 90,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  right: {
    position: "absolute",
    right: "50%",
    zIndex: 1,
    transform: [
      { rotate: "10deg" },
      { scale: 0.8 },
      { translateX: 168 / 2 + 155 },
    ],
    top: 80,
  },
  left: {
    position: "absolute",
    left: "50%",
    zIndex: 1,
    transform: [
      { rotate: "-10deg" },
      { scale: 0.8 },
      { translateX: -168 / 2 - 155 },
    ],
    top: 80,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  stateColor: {
    position: "absolute",
    top: -1000,
    left: 0,
    right: 0,
    height: 1000,
  },
});
