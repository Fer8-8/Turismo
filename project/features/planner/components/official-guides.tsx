import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { SectionHeader } from "@/features/home/components/section-header";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import { OfficialGuidesItem } from "./official-guides-item";

export function OfficialGuides() {
  return (
    <View>
      <SectionHeader title="Guías oficiales" />
      <HorizontalScroll>
        <OfficialGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <OfficialGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <OfficialGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <OfficialGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <OfficialGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <OfficialGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
        <OfficialGuidesItem
          imageUrl={IMAGE_PLACEHOLDER}
          subtitle="Jalisco"
          title="Ruta del Mezcal"
        />
      </HorizontalScroll>
    </View>
  );
}
