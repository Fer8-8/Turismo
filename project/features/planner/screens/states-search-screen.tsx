import { View } from "react-native";
import { LAYOUT } from "@/lib/theme";
import ChooseState from "../components/choose-state";

export function StatesSearchScreen() {
  return (
    <View style={LAYOUT.flex1}>
      <ChooseState />
    </View>
  );
}
