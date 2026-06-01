import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { ValidRegions } from "@/gql/graphql";
import { SPACING } from "@/lib/theme";
import { useGetCities } from "../../api/get-cities";
import { CitiesItem } from "./cities-item";

const GAP = SPACING.sm;
const TALL_HEIGHT = 300;
const SMALL_HEIGHT = (TALL_HEIGHT - GAP) / 2;

const REGIONS = [ValidRegions.Centro, ValidRegions.Bajio];

export function CenterCities() {
  const router = useRouter();
  const { data } = useGetCities(REGIONS);

  function handleSeeAll() {
    router.push({
      pathname: "/home/results",
      params: { regions: REGIONS },
    });
  }

  function navigateToPlace(placeId: string) {
    router.push({
      pathname: "/home/[place]",
      params: { place: placeId },
    });
  }

  return (
    <View>
      <SectionHeader
        onPressRightText={handleSeeAll}
        rightText="ver más"
        title="Centro de México"
      />
      <View style={styles.grid}>
        {/* Columna izquierda — card grande */}
        <View style={styles.column}>
          {data?.[0] && (
            <Pressable
              onPress={() => navigateToPlace(data[0].id)}
              style={styles.tallCard}
            >
              <CitiesItem
                city={data[0].name}
                imageUrl={data[0].medias?.[0]?.url}
                style={styles.card}
              />
            </Pressable>
          )}
        </View>

        {/* Columna derecha — dos cards apiladas */}
        <View style={[styles.column, styles.columnRight]}>
          {data?.[1] && (
            <Pressable
              onPress={() => navigateToPlace(data[1].id)}
              style={styles.smallCard}
            >
              <CitiesItem
                city={data[1].name}
                imageUrl={data[1].medias?.[0]?.url}
                style={styles.card}
              />
            </Pressable>
          )}
          {data?.[2] && (
            <Pressable
              onPress={() => navigateToPlace(data[2].id)}
              style={styles.smallCard}
            >
              <CitiesItem
                city={data[2].name}
                imageUrl={data[2].medias?.[0]?.url}
                style={styles.card}
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    gap: GAP,
  },
  column: {
    flex: 1,
  },
  columnRight: {
    gap: GAP,
  },
  card: {
    width: "100%",
    height: "100%",
  },
  tallCard: {
    width: "100%",
    height: TALL_HEIGHT,
  },
  smallCard: {
    width: "100%",
    height: SMALL_HEIGHT,
  },
});
