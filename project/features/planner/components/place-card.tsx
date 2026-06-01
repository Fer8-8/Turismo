// features/planner/components/PlaceCard.tsx
import { Image } from "expo-image";
import {
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { CheckButton } from "@/features/planner/components/check-button";

type PlaceCardProps = {
  number: number;
  title: string;
  category: string;
  imageUri: ImageSourcePropType;
  selected: boolean;
  onSelect: () => void;
};

export function PlaceCard({
  number,
  title,
  category,
  imageUri,
  selected,
  onSelect,
}: PlaceCardProps) {
  return (
    <Pressable onPress={onSelect}>
      <View style={styles.card}>
        <Text color="muted" style={styles.number} variant="body">
          {number}
        </Text>
        <Image contentFit="cover" source={imageUri} style={styles.image} />
        <View style={styles.textContainer}>
          <Text color="title" style={styles.title} variant="body">
            {title}
          </Text>
          <Text style={styles.category} variant="caption">
            {category}
          </Text>
        </View>
        <CheckButton
          onPress={() => {
            "";
          }}
          selected={selected}
          size={20}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  number: {
    width: 20,
    marginRight: 8,
    textAlign: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: 2,
  },
  category: {},
});
