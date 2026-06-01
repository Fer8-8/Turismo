import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { ValidRegions } from "@/gql/graphql";
import { SPACING } from "@/lib/theme";
import { useGetCities } from "../../api/get-cities";
import { CitiesItem } from "./cities-item";

const REGIONS = [ValidRegions.Norte];

export function NorthCities() {
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
        title="Norte de México"
      />
      <View style={styles.grid}>
        {data?.[0] && (
          <Pressable
            onPress={() => navigateToPlace(data[0].id)}
            style={styles.card}
          >
            <CitiesItem
              city={data[0].name}
              imageUrl={data[0].medias?.[0]?.url}
              style={styles.cardInner}
            />
          </Pressable>
        )}
        {data?.[1] && (
          <Pressable
            onPress={() => navigateToPlace(data[1].id)}
            style={styles.card}
          >
            <CitiesItem
              city={data[1].name}
              imageUrl={data[1].medias?.[0]?.url}
              style={styles.cardInner}
            />
          </Pressable>
        )}
        {data?.[2] && (
          <Pressable
            onPress={() => navigateToPlace(data[2].id)}
            style={styles.card}
          >
            <CitiesItem
              city={data[2].name}
              imageUrl={data[2].medias?.[0]?.url}
              style={styles.cardInner}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  card: {
    flex: 1,
    width: undefined,
    height: 200,
  },
  cardInner: {
    width: "100%",
    height: "100%",
  },
});
