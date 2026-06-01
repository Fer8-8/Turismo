import { Image } from "expo-image";
import { ImageBackground, StyleSheet, View } from "react-native";
import { RADIUS, SPACING } from "@/lib/theme";

type Icons =
  | "aguascalientes"
  | "ave"
  | "bajaCalifornia"
  | "bajaCaliforniaSur"
  | "campeche"
  | "chiapas"
  | "chihuahua"
  | "coahuila"
  | "colima"
  | "durango"
  | "estadoDeMexico"
  | "guanajuato"
  | "guerrero"
  | "hidalgo"
  | "jalisco"
  | "michoacan"
  | "morelos"
  | "nayarit"
  | "nuevoLeon"
  | "oaxaca"
  | "tolteca"
  | "puebla"
  | "queretaro"
  | "quintanaRoo"
  | "rueda"
  | "sanLuisPotosi"
  | "sinaloa"
  | "sonora"
  | "tabasco"
  | "tamaulipas"
  | "tlaxcala"
  | "veracruz"
  | "yucatan"
  | "zacatecas";

const STAMP_ICONS: Record<Icons, File> = {
  aguascalientes: require("@/assets/images/stamp-icon/aguascalientes-icon.png"),
  ave: require("@/assets/images/stamp-icon/ave-icon.png"),
  bajaCalifornia: require("@/assets/images/stamp-icon/baja-california-icon.png"),
  bajaCaliforniaSur: require("@/assets/images/stamp-icon/baja-california-sur-icon.png"),
  campeche: require("@/assets/images/stamp-icon/campeche-icon.png"),
  chiapas: require("@/assets/images/stamp-icon/chiapas-icon.png"),
  chihuahua: require("@/assets/images/stamp-icon/chihuahua-icon.png"),
  coahuila: require("@/assets/images/stamp-icon/coahuila-icon.png"),
  colima: require("@/assets/images/stamp-icon/colima-icon.png"),
  durango: require("@/assets/images/stamp-icon/durango-icon.png"),
  estadoDeMexico: require("@/assets/images/stamp-icon/estado-de-mexico-icon.png"),
  guanajuato: require("@/assets/images/stamp-icon/guanajuato-icon.png"),
  guerrero: require("@/assets/images/stamp-icon/guerrero-icon.png"),
  hidalgo: require("@/assets/images/stamp-icon/hidalgo-icon.png"),
  jalisco: require("@/assets/images/stamp-icon/jalisco-icon.png"),
  michoacan: require("@/assets/images/stamp-icon/michoacan-icon.png"),
  morelos: require("@/assets/images/stamp-icon/morelos-icon.png"),
  nayarit: require("@/assets/images/stamp-icon/nayarit-icon.png"),
  nuevoLeon: require("@/assets/images/stamp-icon/nuevo-leon-icon.png"),
  oaxaca: require("@/assets/images/stamp-icon/oaxaca-icon.png"),
  tolteca: require("@/assets/images/stamp-icon/tolteca-icon.png"),
  puebla: require("@/assets/images/stamp-icon/puebla-icon.png"),
  queretaro: require("@/assets/images/stamp-icon/queretaro-icon.png"),
  quintanaRoo: require("@/assets/images/stamp-icon/quintana-roo-icon.png"),
  rueda: require("@/assets/images/stamp-icon/rueda-icon.png"),
  sanLuisPotosi: require("@/assets/images/stamp-icon/san-luis-icon.png"),
  sinaloa: require("@/assets/images/stamp-icon/sinaloa-icon.png"),
  sonora: require("@/assets/images/stamp-icon/sonora-icon.png"),
  tabasco: require("@/assets/images/stamp-icon/tabasco-icon.png"),
  tamaulipas: require("@/assets/images/stamp-icon/tamaulipas-icon.png"),
  tlaxcala: require("@/assets/images/stamp-icon/tlaxcala-icon.png"),
  veracruz: require("@/assets/images/stamp-icon/veracruz-icon.png"),
  yucatan: require("@/assets/images/stamp-icon/yucatan-icon.png"),
  zacatecas: require("@/assets/images/stamp-icon/zacatecas-icon.png"),
};

type StampProps = {
  iconName: Icons;
  color: string;
};

export function Stamp({ iconName, color }: StampProps) {
  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        source={require("../.././../assets/images/stampBackground.png")}
        style={{
          justifyContent: "center",
          alignContent: "center",
          width: 168,
          height: 141,
        }}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: color,
              marginHorizontal: SPACING.lg,
              marginVertical: SPACING.lg,
              borderRadius: RADIUS.sm,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Image
            contentFit="contain"
            // source={{ uri: imageUrl }}
            source={STAMP_ICONS[iconName]}
            style={{ width: 97, height: 100 }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}
