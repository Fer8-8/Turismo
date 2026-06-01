import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { HeaderButtonIcon } from "@/components/layout/header-button-icon";
import { Text } from "@/components/ui/text";
import { HEADER_HEIGHT, SPACING } from "@/lib/theme";

export function PlansHeader() {
  const router = useRouter();
  // const { showDetached, dismissDetached } = useTabActions();

  // function showFilterModal() {
  //   showDetached(() => <PlansFilters />, {
  //     outsideTouchAction: () => dismissDetached(),
  //   });
  // }

  return (
    <>
      <View style={styles.leftAction}>
        {/*<HeaderButtonIcon
          iconName="filter"
          iconSize={20}
          onPress={showFilterModal}
        />*/}
      </View>

      <Text align="center" variant="subtitle">
        Mis planes
      </Text>

      <View style={styles.rightAction}>
        <HeaderButtonIcon
          iconName="plus"
          onPress={() => {
            router.push("/itinerary/new-itinerary");
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  leftAction: {
    width: 38,
    height: 38,
    position: "absolute",
    left: SPACING.lg,
    top: (HEADER_HEIGHT - 38) / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 38,
    paddingHorizontal: 0,
  },
  rightAction: {
    width: 38,
    height: 38,
    position: "absolute",
    right: SPACING.lg,
    top: (HEADER_HEIGHT - 38) / 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
  },
});
