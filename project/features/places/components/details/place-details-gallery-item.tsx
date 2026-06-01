/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — PlaceDetailsGalleryItem
 *
 * OPEN
 *    0ms   user taps thumbnail → modal mounts
 *    0ms   backdrop fades in (opacity 0 → 1)
 *    0ms   image springs in (scale 0.88 → 1, opacity 0 → 1)
 *
 * DRAG TO DISMISS
 *    —     image follows finger (translateY tracks pan)
 *    —     backdrop dims as user pulls down (opacity tracks drag)
 *
 * CLOSE (drag past threshold OR snap back)
 *  180ms   image fades + zooms out
 *  180ms   backdrop fades out → modal unmounts
 * ───────────────────────────────────────────────────────── */

import { Image } from "expo-image";
import { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { CardFeatured } from "@/components/ui/card-feature";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/lib/constants";

/* ── Spring / timing configs ─────────────────────────────── */
const BACKDROP = {
  fadeDuration: 250, // ms to fade in/out
};

const IMAGE = {
  initialScale: 0.88, // scale before open spring
  spring: {
    mass: 1, // natural weight
    damping: 28, // higher = less bounce
    stiffness: 200,
  },
  closeDuration: 180, // ms for close timing
};

const DISMISS = {
  threshold: 100, // px drag before auto-dismiss
  dragResistance: 0.6, // friction factor while dragging up
};

/* ─────────────────────────────────────────────────────────── */

type PlaceDetailsGalleryItemProps = {
  imageUrl: string;
  imageHeight: number;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function PlaceDetailsGalleryItem({
  imageUrl,
  imageHeight,
}: PlaceDetailsGalleryItemProps) {
  const [visible, setVisible] = useState(false);

  const backdropOpacity = useSharedValue(0);
  const imageScale = useSharedValue(IMAGE.initialScale);
  const imageOpacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  function open() {
    setVisible(true);
    translateY.value = 0;
    backdropOpacity.value = withTiming(1, { duration: BACKDROP.fadeDuration });
    imageScale.value = withSpring(1, IMAGE.spring);
    imageOpacity.value = withTiming(1, { duration: IMAGE.closeDuration });
  }

  function dismiss() {
    "worklet";
    backdropOpacity.value = withTiming(0, { duration: IMAGE.closeDuration });
    imageScale.value = withTiming(0, { duration: IMAGE.closeDuration });
    imageOpacity.value = withTiming(
      0,
      { duration: IMAGE.closeDuration },
      (done) => {
        if (done) {
          scheduleOnRN(setVisible, false);
        }
      }
    );
  }

  function snapBack() {
    "worklet";
    translateY.value = withSpring(0, IMAGE.spring);
    backdropOpacity.value = withTiming(1, { duration: BACKDROP.fadeDuration });
    imageScale.value = withSpring(1, IMAGE.spring);
    imageOpacity.value = withTiming(1, { duration: IMAGE.closeDuration });
  }

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const dy = e.translationY;
      const progress = Math.max(0, dy / DISMISS.threshold); // 0 → 1 as user drags down
      // resist upward drag, allow downward freely
      translateY.value = dy > 0 ? dy : dy * DISMISS.dragResistance;
      backdropOpacity.value = Math.max(0, 1 - progress * 0.8);
      imageScale.value = Math.max(0.2, 1 - progress * 0.12); // shrinks toward 0.75
      imageOpacity.value = Math.max(0.2, 1 - progress * 0.5); // fades toward 0.4
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS.threshold) {
        dismiss();
      } else {
        snapBack();
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }, { translateY: translateY.value }],
  }));

  return (
    <>
      <Pressable onPress={open}>
        <CardFeatured style={[styles.imageContainer, { height: imageHeight }]}>
          <CardFeatured.Image source={{ uri: imageUrl }} />
        </CardFeatured>
      </Pressable>

      <Modal
        animationType="none"
        statusBarTranslucent
        transparent
        visible={visible}
      >
        <GestureHandlerRootView>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
          />

          <GestureDetector gesture={pan}>
            <AnimatedImage
              contentFit="contain"
              source={{ uri: imageUrl }}
              style={[styles.fullscreenImage, imageStyle]}
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.92)",
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
