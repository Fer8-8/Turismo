import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { RADIUS, SPACING } from "@/lib/theme";
import { STAMP_STATES } from "../constants/mexico-stamp-states";

type StampStatesProps = {
  state: keyof typeof STAMP_STATES;
};

export const StampStates = ({ state }: StampStatesProps) => {
  const selectedState = STAMP_STATES[state];
  if (!selectedState) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        contentFit="fill"
        source={require("../../../assets/images/stampBackground.png")}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[styles.stampCard, { backgroundColor: selectedState.color }]}
      >
        <Text color="inverse">{selectedState.title}</Text>
        <View style={styles.subTitle}>
          <Text color="inverse-muted" variant="caption">
            {selectedState.subtitle}
          </Text>
        </View>
        <Image
          contentFit="contain"
          source={selectedState.icon}
          style={[styles.icon, selectedState.iconStyle]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 178 / 151,
  },
  stampCard: {
    flex: 1,
    margin: SPACING.lg,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  subTitle: {
    flexDirection: "row",
    marginTop: 2,
  },
  icon: {
    position: "absolute",
    width: "63%",
    height: "69%",
  },
});
