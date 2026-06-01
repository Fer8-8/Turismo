import { Ionicons } from "@expo/vector-icons";
import { type ImageSourcePropType, StyleSheet, View } from "react-native";
import { CardRow } from "@/components/ui/card-row";
import { SPACING } from "@/lib/theme";

type ExperiencesProps = {
  icon: ImageSourcePropType;
  title: string;
  subtitle: string;
};
export function UniqueExperienceItem({
  icon,
  title,
  subtitle,
}: ExperiencesProps) {
  return (
    <CardRow style={styles.card}>
      <CardRow.Icon source={icon} />
      <CardRow.Content>
        <View style={styles.content}>
          <CardRow.Title>{title}</CardRow.Title>
          <CardRow.Subtitle>{subtitle}</CardRow.Subtitle>
        </View>
      </CardRow.Content>
      <View style={styles.iconContainer}>
        <Ionicons
          name="chevron-forward"
          size={18}
          style={{ color: "#8A8A8A" }}
        />
      </View>
    </CardRow>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 74,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    right: SPACING.md,
    top: 27,
  },
});
