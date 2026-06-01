import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

type SideProgressProps = {
  currentDay: number;
};

export function SideProgress({ currentDay }: SideProgressProps) {
  const blackBarHeight = currentDay * 66;

  return (
    <View style={styles.container}>
      <View style={styles.grayBar} />

      <View style={[styles.blackBar, { height: blackBarHeight }]} />

      <View style={[styles.circle, { top: 10 }]}>
        <Text style={styles.circleText}>1</Text>
      </View>
      <View style={[styles.circle, { top: 295 }]}>
        <Text style={styles.circleText}>2</Text>
      </View>
      <View style={[styles.circle, { top: 580 }]}>
        <Text style={styles.circleText}>3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 18,
    height: 632,
  },
  grayBar: {
    position: "absolute",
    left: 5,
    width: 7,
    height: 632,
    backgroundColor: "#EDEDED",
    borderRadius: 5,
  },
  blackBar: {
    position: "absolute",
    left: 5,
    width: 7,
    backgroundColor: "#000000",
    borderRadius: 5,
    top: 0,
  },
  circle: {
    position: "absolute",
    left: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
