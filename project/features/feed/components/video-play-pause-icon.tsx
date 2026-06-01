import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, type ViewProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";

type VideoPlayPauseIconProps = AnimatedProps<ViewProps> & {
  isPlaying: boolean;
};

export function VideoPlayPauseIcon({
  isPlaying,
  style,
  ...props
}: VideoPlayPauseIconProps) {
  return (
    <Animated.View style={[styles.playButton, style]} {...props}>
      <Ionicons color="white" name={isPlaying ? "pause" : "play"} size={36} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    backgroundColor: "#14141480",
    borderRadius: 50,
    padding: 12,
  },
});
