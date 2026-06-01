import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SPACING } from "@/lib/theme";
import { useGetCategories } from "../api/get-categories";
import { ExporeInterestsItem } from "./explore-interests-item";
import { SectionHeader } from "./section-header";

export function ExploreByInterests() {
  const { data: categories } = useGetCategories();
  const router = useRouter();

  function handleCategoryPress(category: string) {
    const categoryData = categories?.find((cat) => cat.category === category);
    if (categoryData) {
      router.push({
        pathname: "/home/results",
        params: { categoryId: categoryData.id_category },
      });
    }
  }

  return (
    <View>
      <SectionHeader title="Explorar por intereses" />

      <View style={styles.content}>
        <ExporeInterestsItem
          icon={require("@/assets/icons/categories/icon-interest/cultura.png")}
          onPress={() => handleCategoryPress("Cultura")}
          title="Cultura"
        />
        <ExporeInterestsItem
          icon={require("@/assets/icons/categories/icon-interest/gastronomia.png")}
          onPress={() => handleCategoryPress("Gastronomia")}
          title="Gastronomía"
        />
        <ExporeInterestsItem
          icon={require("@/assets/icons/categories/icon-interest/naturaleza.png")}
          onPress={() => handleCategoryPress("Naturaleza")}
          title="Naturaleza"
        />
      </View>
      <View style={[styles.content, { marginTop: 8 }]}>
        <ExporeInterestsItem
          icon={require("@/assets/icons/categories/icon-interest/playas.png")}
          onPress={() => handleCategoryPress("Playa")}
          title="Playas y relax"
        />
        <ExporeInterestsItem
          icon={require("@/assets/icons/categories/icon-interest/vida.png")}
          onPress={() => handleCategoryPress("Vida Nocturna")}
          title="Vida nocturna"
        />
        <ExporeInterestsItem
          icon={require("@/assets/icons/categories/icon-interest/pyramid.png")}
          onPress={() => handleCategoryPress("Zona arqueológica")}
          title="Templos"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    marginHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
});
