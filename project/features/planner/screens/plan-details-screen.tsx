import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { FullPageContainer } from "@/components/full-page-container";
import { LargeTitle } from "@/components/ui/large-title";
import { PlanCard } from "@/features/planner/components/plan-card";
import { SideProgress } from "@/features/planner/components/side-progress";
import { SPACING } from "@/lib/theme";

const CARDS_DATA = [
  {
    id: 1,
    day: 1,
    titleKey: "planDetails.card1.title",
    descriptionKey: "planDetails.card1.description",
    categoryKey: "planDetails.card1.category",
    image: require("@/assets/icons/categories/collage.png"),
  },
  {
    id: 2,
    day: 1,
    titleKey: "planDetails.card2.title",
    descriptionKey: "planDetails.card2.description",
    categoryKey: "planDetails.card2.category",
    image: require("@/assets/icons/categories/collage.png"),
  },
  {
    id: 3,
    day: 2,
    titleKey: "planDetails.card3.title",
    descriptionKey: "planDetails.card3.description",
    categoryKey: "planDetails.card3.category",
    image: require("@/assets/icons/categories/collage.png"),
  },
  {
    id: 4,
    day: 2,
    titleKey: "planDetails.card4.title",
    descriptionKey: "planDetails.card4.description",
    categoryKey: "planDetails.card4.category",
    image: require("@/assets/icons/categories/collage.png"),
  },
  {
    id: 5,
    day: 3,
    titleKey: "planDetails.card5.title",
    descriptionKey: "planDetails.card5.description",
    categoryKey: "planDetails.card5.category",
    image: require("@/assets/icons/categories/collage.png"),
  },
];

export default function PlanDetailsScreen() {
  const { t } = useTranslation();

  const currentDay = 1;
  return (
    <FullPageContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LargeTitle style={styles.title}>{t("planDetails.title")}</LargeTitle>

        <View style={styles.contentWrapper}>
          <SideProgress currentDay={currentDay} />

          <View style={styles.cardsContainer}>
            {CARDS_DATA.map((item) => (
              <PlanCard
                category={t(item.categoryKey)}
                day={item.day}
                description={t(item.descriptionKey)}
                imageUri={item.image}
                key={item.id}
                title={t(item.titleKey)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </FullPageContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: SPACING["4xl"],
  },
  title: {
    textAlign: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  contentWrapper: {
    position: "relative",
    minHeight: 700,
  },
  cardsContainer: {
    marginLeft: 30,
    gap: SPACING.md,
  },
});
