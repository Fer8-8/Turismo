import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { LargeTitle } from "@/components/ui/large-title";
import { MEXICO_STATES, type MexicoState } from "@/lib/constants";
import { LAYOUT, NAVIGATION_HEIGTH, SPACING, THEME } from "@/lib/theme";

export default function StateList() {
  const [selectedState, setSelectedState] = useState<MexicoState | null>(null);
  return (
    <>
      <View style={{ paddingBottom: SPACING.md }}>
        <LargeTitle align="center">
          ¿Qué ciudad te gustaría explorar?
        </LargeTitle>
      </View>
      <View style={LAYOUT.flex1}>
        <View style={[LAYOUT.flex1, styles.content]}>
          <FlashList
            contentContainerStyle={{
              paddingHorizontal: SPACING.lg,
              paddingBottom: NAVIGATION_HEIGTH + SPACING["3xl"],
            }}
            data={MEXICO_STATES}
            ItemSeparatorComponent={() => (
              <View style={{ marginVertical: SPACING.xs }} />
            )}
            keyExtractor={(item) => item}
            renderItem={({ item }: { item: MexicoState }) => (
              <Button
                onPress={() => {
                  setSelectedState(item);
                }}
                style={[
                  styles.button,
                  selectedState === item && styles.selected,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    selectedState === item && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
                <Image
                  source={require("@/assets/images/stamp-icon/reilete.png")}
                  style={styles.image}
                />
              </Button>
            )}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING.md,
  },
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderRadius: SPACING.lg,
    backgroundColor: THEME.card,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    height: "auto",
  },
  selected: {
    borderColor: "#cbe1ff",
    backgroundColor: "#3b83f627",
  },
  text: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedText: {
    color: "#3B82F6",
  },
  image: {
    width: 24,
    height: 32,
    resizeMode: "contain",
  },
});
