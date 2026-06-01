import { View } from "react-native";
import { CardRow } from "@/components/ui/card-row";
import { formatRangeDate } from "@/lib/dates";

type NextCulturalEventItemProps = {
  eventName: string;
  eventState: string;
  eventEndDate: string;
  eventStartDate: string;
  eventImageUrl: string;
};

export function NextCulturalEventItem({
  eventName,
  eventState,
  eventEndDate,
  eventStartDate,
  eventImageUrl,
}: NextCulturalEventItemProps) {
  return (
    <CardRow>
      <CardRow.Image source={{ uri: eventImageUrl }} />
      <CardRow.Content>
        <View>
          <CardRow.Title>{eventName}</CardRow.Title>
          <CardRow.Subtitle>{eventState}</CardRow.Subtitle>
        </View>

        <CardRow.Subtitle>
          {formatRangeDate(eventStartDate, eventEndDate)}
        </CardRow.Subtitle>
      </CardRow.Content>
    </CardRow>
  );
}
