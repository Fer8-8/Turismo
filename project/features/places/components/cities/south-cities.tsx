import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { ValidRegions } from "@/gql/graphql";
import { SPACING } from "@/lib/theme";
import { useGetCities } from "../../api/get-cities";
import { CitiesItem } from "./cities-item";

const REGIONS = [ValidRegions.Caribe, ValidRegions.Pacifico];

export function SouthCities() {
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
        title="Sur de México"
      />
      <View style={styles.grid}>
        {/* Card ancha arriba */}
        {data?.[0] && (
          <Pressable
            onPress={() => navigateToPlace(data[0].id)}
            style={styles.topCard}
          >
            <CitiesItem
              city={data[0].name}
              imageUrl={data[0].medias?.[0]?.url}
              style={styles.card}
            />
          </Pressable>
        )}

        {/* Dos cards iguales abajo */}
        <View style={styles.row}>
          {data?.[1] && (
            <Pressable
              onPress={() => navigateToPlace(data[1].id)}
              style={styles.bottomCard}
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
              style={styles.bottomCard}
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
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  topCard: {
    width: "100%",
    height: 160,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  bottomCard: {
    flex: 1,
    width: undefined,
    height: 130,
  },
  card: {
    width: "100%",
    height: "100%",
  },
});
