import { useEvent } from "expo";
import type { VideoPlayer } from "expo-video";
import { Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { SCREEN_WIDTH } from "@/lib/constants";

export function useVideoControls(player: VideoPlayer) {
  const translateX = useSharedValue(0);
  const startTime = useSharedValue(0);
  const duration = useSharedValue(player.duration);
  const previewTime = useSharedValue(0);
  const isScrubbing = useSharedValue(false);

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  function toggleVideo() {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  function pauseVideo() {
    player.pause();
  }

  function playVideo() {
    player.play();
  }

  function seekTo(time: number) {
    const lastTime = player.currentTime;
    const dif = Math.abs(time - lastTime);

    if (dif < 0.5) {
      return;
    }

    player.currentTime = time;
  }

  function captureTimes() {
    startTime.value = player.currentTime;
    previewTime.value = player.currentTime;
    duration.value = player.duration;
  }

  const seekVideoGesture = Gesture.Pan()
    .enabled(player.duration > 0)
    .activeOffsetX([-10, 10])
    .onStart(() => {
      isScrubbing.value = true;

      scheduleOnRN(captureTimes);
      scheduleOnRN(pauseVideo);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;

      // Map finger position on screen to video progress
      // left edge (0%) → start of video
      // right edge (100%) → end of video
      const progress = Math.min(Math.max(event.absoluteX / SCREEN_WIDTH, 0), 1);
      let nextTime = progress * duration.value;

      // clamp between 0 and duration
      if (nextTime < 0) {
        nextTime = 0;
      }
      if (duration.value && nextTime > duration.value) {
        nextTime = duration.value;
      }

      previewTime.value = nextTime;

      scheduleOnRN(seekTo, nextTime);
    })
    .onEnd(() => {
      translateX.value = 0;
      isScrubbing.value = false;

      scheduleOnRN(playVideo);
    });

  return {
    toggleVideo,
    isPlaying,
    player,
    seekVideoGesture,

    isScrubbing,
    previewTime,
    startTime,
    duration,
  };
}
