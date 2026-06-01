import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { BookFooter } from "@/features/booking/components/footers/book-footer";
import { PlaceDetailsHeader } from "@/features/places/components/details/place-details-header";
import { PlaceDetailsSheetInfo } from "@/features/places/components/details/place-details-sheet-info";
import { PlaceDetailsVideoPlayer } from "@/features/places/components/details/place-details-video-player";
import { SCREEN_HEIGHT } from "@/lib/constants";
import { useTabActions } from "@/navigation/store/tab-store";

export function PlaceDetailsScreen() {
  const { place } = useLocalSearchParams();
  const placeId = Array.isArray(place) ? place[0] : place;

  const stablePlaceId = useRef<string | undefined>(undefined);
  if (placeId) {
    stablePlaceId.current = placeId;
  }

  const { showDetached, dismissDetached } = useTabActions();

  useFocusEffect(
    useCallback(() => {
      const id = stablePlaceId.current;
      if (!id) {
        return;
      }

      showDetached(() => <PlaceDetailsSheetInfo placeId={id} />, {
        bottomSpacing: 0,
        width: "full",
        enableBottomSheet: true,
        snapPoints: [0.3, 0.9],
        footerContent: () => <BookFooter />,
      });
      return () => {
        dismissDetached();
      };
    }, [showDetached, dismissDetached])
  );

  return (
    <View style={styles.container}>
      <PlaceDetailsHeader />
      <PlaceDetailsVideoPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  content: {
    height: SCREEN_HEIGHT - SCREEN_HEIGHT * 0.22,
  },
  item: {
    height: SCREEN_HEIGHT - SCREEN_HEIGHT * 0.22,
  },
});
