import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { SectionHeader } from "@/features/home/components/section-header";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { PopularGuidesItem } from "./popular-guides-item";

export function PopularGuidesList() {
  return (
    <View>
      <SectionHeader title="Destinos más visitados" />
      <HorizontalScroll>
        <PopularGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <PopularGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <PopularGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <PopularGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <PopularGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <PopularGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <PopularGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
      </HorizontalScroll>
    </View>
  );
}
