import { View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { SPACING } from "@/lib/theme";
import { UniqueExperienceItem } from "./unique-experience-item";

export function UniqueExperiencesList() {
  return (
    <View>
      <SectionHeader title="Experiencias únicas" />
      <View style={{ gap: SPACING.sm }}>
        <UniqueExperienceItem
          icon={require("@/assets/icons/categories/icon-experiences/luchador.png")}
          subtitle="48 experiencias"
          title="Festivales y tradiciones"
        />
        <UniqueExperienceItem
          icon={require("@/assets/icons/categories/icon-experiences/burro.png")}
          subtitle="48 experiencias"
          title="Festivales y tradiciones"
        />
        <UniqueExperienceItem
          icon={require("@/assets/icons/categories/icon-experiences/artesanias.png")}
          subtitle="48 experiencias"
          title="Festivales y tradiciones"
        />
        <UniqueExperienceItem
          icon={require("@/assets/icons/categories/icon-experiences/cabeza.png")}
          subtitle="48 experiencias"
          title="Festivales y tradiciones"
        />
      </View>
    </View>
  );
}
