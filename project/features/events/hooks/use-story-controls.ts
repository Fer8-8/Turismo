import { useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/lib/constants";
import type { Origin } from "../types";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — StoryVideoPlayer
 *
 * OPEN
 *    0ms   modal mounts
 *    0ms   backdrop fades in (opacity 0 → 1)
 *    0ms   container springs in (scale 0.88 → 1, opacity 0 → 1)
 *
 * DRAG TO DISMISS
 *    —     container follows finger (translateY tracks pan)
 *    —     backdrop dims as user pulls down
 *
 * CLOSE (drag past threshold OR close button)
 * 350ms   container flies toward origin thumbnail (scale + translate)
 * 350ms   backdrop fades out → modal unmounts
 * ───────────────────────────────────────────────────────── */

const BACKDROP = { fadeDuration: 250 };
const CONTAINER = {
  initialScale: 0.88,
  spring: { mass: 1, damping: 28, stiffness: 200 },
  openDuration: 180,
};
const DISMISS = {
  threshold: 100,
  dragResistance: 0.6,
  duration: 350,
  outScaleFactor: 0.3,
};

type UseStoryControlsParams = {
  videoUrl: string;
  origin: Origin | null;
  onClose: () => void;
};

export function useStoryControls({
  videoUrl,
  origin,
  onClose,
}: UseStoryControlsParams) {
  const backdropOpacity = useSharedValue(0);
  const containerScale = useSharedValue(CONTAINER.initialScale);
  const containerOpacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDismissing = useSharedValue(false);

  // Stored as shared values so the dismiss worklet can read them on the UI thread.
  const targetScale = useSharedValue(CONTAINER.initialScale);
  const targetTX = useSharedValue(0);
  const targetTY = useSharedValue(0);

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (origin) {
      targetScale.value = origin.width / SCREEN_WIDTH;
      targetTX.value = origin.x + origin.width / 2 - SCREEN_WIDTH / 2;
      targetTY.value = origin.y + origin.height / 2 - SCREEN_HEIGHT / 2;
    }

    player.play();
    backdropOpacity.value = withTiming(1, { duration: BACKDROP.fadeDuration });
    containerScale.value = withSpring(1, CONTAINER.spring);
    containerOpacity.value = withTiming(1, {
      duration: CONTAINER.openDuration,
    });
  }, [
    origin,
    targetScale,
    targetTX,
    targetTY,
    containerOpacity,
    containerScale,
    backdropOpacity,
    player,
  ]);

  function pauseVideo() {
    player.pause();
  }

  function playVideo() {
    player.play();
  }

  function handleClose() {
    player.pause();
    onClose();
  }

  function dismiss() {
    "worklet";
    backdropOpacity.value = withTiming(0, { duration: DISMISS.duration });
    containerScale.value = withTiming(
      targetScale.value * DISMISS.outScaleFactor,
      {
        duration: DISMISS.duration,
      }
    );
    translateX.value = withTiming(targetTX.value, {
      duration: DISMISS.duration,
    });
    translateY.value = withTiming(targetTY.value, {
      duration: DISMISS.duration,
    });
    containerOpacity.value = withTiming(
      0,
      { duration: DISMISS.duration },
      (done) => {
        if (done) {
          scheduleOnRN(handleClose);
        }
      }
    );
  }

  function snapBack() {
    "worklet";
    translateX.value = withSpring(0, CONTAINER.spring);
    translateY.value = withSpring(0, CONTAINER.spring);
    backdropOpacity.value = withTiming(1, { duration: BACKDROP.fadeDuration });
    containerScale.value = withSpring(1, CONTAINER.spring);
    containerOpacity.value = withTiming(1, {
      duration: CONTAINER.openDuration,
    });
  }

  const pan = Gesture.Pan()
    .onBegin(() => {
      isDismissing.value = false;
      scheduleOnRN(pauseVideo);
    })
    .onUpdate((e) => {
      const dy = e.translationY;
      const movingDown = dy > 0;
      const progress = Math.max(0, dy / DISMISS.threshold);
      translateY.value = movingDown ? dy : 0;
      translateX.value = movingDown ? e.translationX : 0;
      backdropOpacity.value = Math.max(0, 1 - progress * 0.8);
      containerScale.value = Math.max(0.2, 1 - progress * 0.12);
      containerOpacity.value = Math.max(0.2, 1 - progress * 0.5);
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS.threshold) {
        isDismissing.value = true;
        dismiss();
      } else {
        snapBack();
      }
    })
    .onTouchesUp(() => {
      if (!isDismissing.value) {
        scheduleOnRN(playVideo);
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: containerScale.value },
    ],
  }));

  return { player, pan, dismiss, backdropStyle, containerStyle };
}
