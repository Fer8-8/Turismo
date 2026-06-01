import { Octicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { LAYOUT, THEME } from "@/lib/theme";

type NewPhaseButtonProps = {
  onPress: () => void;
};

export function NextPhaseButton({ onPress }: NewPhaseButtonProps) {
  return (
    <Button onPress={onPress} style={LAYOUT.rowBetween}>
      <Text color="inverse">Siguiente</Text>
      <Octicons
        color={THEME["primary-foreground"]}
        name="arrow-right"
        size={20}
      />
    </Button>
  );
}
