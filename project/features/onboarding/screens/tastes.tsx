import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { LAYOUT, RADIUS, SPACING, THEME } from "@/lib/theme";

type TastesProps = {
  onNext?: () => void;
};

type Option = {
  key: string;
  label: string;
};

type Category = {
  label: string;
  options: Option[];
};

export function Tastes({ onNext }: TastesProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categories: Category[] = [
    {
      label: t("onboarding.tastes.vibe.label"),
      options: [
        { key: "beach", label: t("onboarding.tastes.vibe.beach") },
        { key: "mountain", label: t("onboarding.tastes.vibe.mountain") },
        { key: "city", label: t("onboarding.tastes.vibe.city") },
        { key: "magicalTown", label: t("onboarding.tastes.vibe.magicalTown") },
        { key: "jungle", label: t("onboarding.tastes.vibe.jungle") },
        { key: "desert", label: t("onboarding.tastes.vibe.desert") },
      ],
    },
    {
      label: t("onboarding.tastes.activities.label"),
      options: [
        {
          key: "gastronomy",
          label: t("onboarding.tastes.activities.gastronomy"),
        },
        {
          key: "nightlife",
          label: t("onboarding.tastes.activities.nightlife"),
        },
        {
          key: "adventure",
          label: t("onboarding.tastes.activities.adventure"),
        },
        { key: "culture", label: t("onboarding.tastes.activities.culture") },
        { key: "relax", label: t("onboarding.tastes.activities.relax") },
        { key: "shopping", label: t("onboarding.tastes.activities.shopping") },
      ],
    },
    {
      label: t("onboarding.tastes.tripType.label"),
      options: [
        { key: "solo", label: t("onboarding.tastes.tripType.solo") },
        { key: "couple", label: t("onboarding.tastes.tripType.couple") },
        { key: "friends", label: t("onboarding.tastes.tripType.friends") },
        { key: "family", label: t("onboarding.tastes.tripType.family") },
        { key: "work", label: t("onboarding.tastes.tripType.work") },
      ],
    },
  ];

  function toggleOption(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <View style={LAYOUT.flex1}>
      <View style={LAYOUT.flex1}>
        <Text variant="title">{t("onboarding.tastes.title")}</Text>
        <Text style={styles.subtitle}>{t("onboarding.tastes.subtitle")}</Text>

        <View style={styles.categories}>
          {categories.map((category) => (
            <View key={category.label} style={styles.category}>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <View style={styles.chips}>
                {category.options.map(({ key, label }) => {
                  const isSelected = selected.has(key);
                  return (
                    <Button
                      disablePressAnimation
                      key={key}
                      onPress={() => toggleOption(key)}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {label}
                      </Text>
                    </Button>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </View>

      <Button onPress={onNext} testID="nextButton">
        {t("common.next")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: SPACING.xs,
  },
  categories: {
    marginTop: SPACING.xl,
    gap: SPACING["2xl"],
  },
  category: {
    gap: SPACING.sm,
  },
  categoryLabel: {
    fontWeight: "600",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  chip: {
    height: "auto",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    borderCurve: "continuous",
    backgroundColor: THEME["surface-secondary"],
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: {
    borderColor: THEME.selected,
    backgroundColor: THEME["selected-overlay"],
  },
  chipText: {
    color: THEME.foreground,
  },
  chipTextSelected: {
    color: THEME.selected,
    fontWeight: "600",
  },
});
