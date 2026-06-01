import { View } from "react-native";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { SectionHeader } from "@/features/home/components/section-header";
import { RecommendedPlaceItem } from "./recommended-place-item";

export function TravelGuidesList() {
  return (
    <View>
      <SectionHeader title="Guías de viaje" />
      <HorizontalScroll>
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1601585144584-2a53183be14c?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Quintana Roo"
          title="Tulum"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1547686669-9a8cb1a22d91?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Yucatán"
          title="Chichén Itzá"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1580934738416-ad531f2920f7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Baja California"
          title="Los Cabos"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1678286274290-2ef1d8446cec?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Durango"
          title="Nombre de Dios"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1601585088624-0a770da2bf21?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Baja California"
          title="Los Cabos"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1524158637050-36b68ca9a5ef?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Baja California"
          title="Los Cabos"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Baja California"
          title="Los Cabos"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Baja California"
          title="Los Cabos"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="Baja California"
          title="Los Cabos"
        />
        <RecommendedPlaceItem
          imageUrl="https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          subtitle="3 dias - 15 lugares"
          title="Los Cabos"
        />
      </HorizontalScroll>
    </View>
  );
}
