import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

type PlanCardProps = {
  title: string;
  description: string;
  category: string;
  imageUri: number;
};

export function PlanCard({
  title,
  description,
  category,
  imageUri,
}: PlanCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <Text
          color="foreground"
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.titleText}
          variant="body"
        >
          {title}
        </Text>

        <Text
          color="muted"
          ellipsizeMode="tail"
          numberOfLines={1}
          style={styles.descriptionText}
          variant="bodySmall"
        >
          {description}
        </Text>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>
      <Image contentFit="cover" source={imageUri} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 330,
    height: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  leftContent: {
    width: 183,
    gap: 4,
    justifyContent: "center",
  },
  titleText: {
    width: 190,
  },
  descriptionText: {
    width: 190,
  },
  categoryBadge: {
    backgroundColor: "#B8B3A826",
    borderRadius: 14,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  categoryText: {
    fontFamily: "Nunito",
    fontWeight: "400",
    fontSize: 10,
    color: "#595959",
  },
  image: {
    width: 97,
    height: 97,
    borderRadius: 4,
    marginLeft: 10,
  },
});
