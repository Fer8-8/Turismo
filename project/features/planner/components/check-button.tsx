import Octicons from "@expo/vector-icons/Octicons";
import { Pressable, StyleSheet } from "react-native";

type CheckButtonProps = {
  selected: boolean;
  onPress: () => void;
  size?: number;
};

export function CheckButton({
  selected,
  onPress,
  size = 18,
}: CheckButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: selected ? "#000000" : "#E0E0E0",
        },
      ]}
    >
      {selected && <Octicons color="#FFFFFF" name="check" size={size * 0.7} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
