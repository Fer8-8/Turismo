import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { SectionHeader } from "@/features/home/components/section-header";
import { LAYOUT } from "@/lib/theme";
import { StampStates } from "../components/stamp-states";

export function StatesGrid() {
  const router = useRouter();

  function handleStateDetails(state: string) {
    router.push({
      pathname: "/home/state/[state]",
      params: {
        state,
      },
    });
  }

  return (
    <View>
      <SectionHeader title="Explorar por estados" />

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("aguascalientes")}
          style={LAYOUT.flex1}
        >
          <StampStates state="aguascalientes" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("bajaCalifornia")}
          style={LAYOUT.flex1}
        >
          <StampStates state="bajaCalifornia" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("bajaCaliforniaSur")}
          style={LAYOUT.flex1}
        >
          <StampStates state="bajaCaliforniaSur" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("campeche")}
          style={LAYOUT.flex1}
        >
          <StampStates state="campeche" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("chiapas")}
          style={LAYOUT.flex1}
        >
          <StampStates state="chiapas" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("chihuahua")}
          style={LAYOUT.flex1}
        >
          <StampStates state="chihuahua" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("coahuila")}
          style={LAYOUT.flex1}
        >
          <StampStates state="coahuila" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("colima")}
          style={LAYOUT.flex1}
        >
          <StampStates state="colima" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("durango")}
          style={LAYOUT.flex1}
        >
          <StampStates state="durango" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("estadoDeMexico")}
          style={LAYOUT.flex1}
        >
          <StampStates state="estadoDeMexico" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("guanajuato")}
          style={LAYOUT.flex1}
        >
          <StampStates state="guanajuato" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("guerrero")}
          style={LAYOUT.flex1}
        >
          <StampStates state="guerrero" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("hidalgo")}
          style={LAYOUT.flex1}
        >
          <StampStates state="hidalgo" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("jalisco")}
          style={LAYOUT.flex1}
        >
          <StampStates state="jalisco" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("michoacan")}
          style={LAYOUT.flex1}
        >
          <StampStates state="michoacan" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("morelos")}
          style={LAYOUT.flex1}
        >
          <StampStates state="morelos" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("nayarit")}
          style={LAYOUT.flex1}
        >
          <StampStates state="nayarit" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("nuevoLeon")}
          style={LAYOUT.flex1}
        >
          <StampStates state="nuevoLeon" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("oaxaca")}
          style={LAYOUT.flex1}
        >
          <StampStates state="oaxaca" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("puebla")}
          style={LAYOUT.flex1}
        >
          <StampStates state="puebla" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("queretaro")}
          style={LAYOUT.flex1}
        >
          <StampStates state="queretaro" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("quintanaRoo")}
          style={LAYOUT.flex1}
        >
          <StampStates state="quintanaRoo" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("sanLuisPotosi")}
          style={LAYOUT.flex1}
        >
          <StampStates state="sanLuisPotosi" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("sinaloa")}
          style={LAYOUT.flex1}
        >
          <StampStates state="sinaloa" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("sonora")}
          style={LAYOUT.flex1}
        >
          <StampStates state="sonora" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("tabasco")}
          style={LAYOUT.flex1}
        >
          <StampStates state="tabasco" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("tamaulipas")}
          style={LAYOUT.flex1}
        >
          <StampStates state="tamaulipas" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("tlaxcala")}
          style={LAYOUT.flex1}
        >
          <StampStates state="tlaxcala" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("veracruz")}
          style={LAYOUT.flex1}
        >
          <StampStates state="veracruz" />
        </Pressable>
        <Pressable
          onPress={() => handleStateDetails("yucatan")}
          style={LAYOUT.flex1}
        >
          <StampStates state="yucatan" />
        </Pressable>
      </View>

      <View style={LAYOUT.row}>
        <Pressable
          onPress={() => handleStateDetails("zacatecas")}
          style={LAYOUT.flex1}
        >
          <StampStates state="zacatecas" />
        </Pressable>
        <View style={LAYOUT.flex1} />
      </View>
    </View>
  );
}
