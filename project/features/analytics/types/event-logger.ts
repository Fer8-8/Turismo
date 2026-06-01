type Interaction =
  | "view"
  | "click"
  | "favorite"
  | "book"
  | "unfavorite"
  | "share"
  | "save"
  | "review"
  | "search_result_click";
type EventDevice = "mobile" | "desktop" | "tablet";

export type EventLoggerConfig = {
  apiUrl: string;
  batchSize?: number;
  flushInterval?: number;
  enableLogging?: boolean;
};

type EventBase = {
  userId: string;
  placeId: string;
  sessionId: string;
  deviceType: EventDevice;
  source: string;
  timeSpentSeconds: number;
  scrollDepth: number;
  positionInList?: number;
  recommendationAlgorithm?: string;
  createdAt: Date;
};

/**
 * Interactions with fixed weights
 */
type WeightedEvent =
  | { interactionType: "view"; interactionWeight: 1.0 }
  | { interactionType: "click"; interactionWeight: 2.0 }
  | { interactionType: "favorite"; interactionWeight: 3.0 }
  | { interactionType: "book"; interactionWeight: 5.0 };

/**
 * All other interactions default to weight = 1
 */
type DefaultWeightEvent = {
  interactionType: Exclude<Interaction, "view" | "click" | "favorite" | "book">;
  interactionWeight?: 1.0;
};

export type Event = EventBase & (WeightedEvent | DefaultWeightEvent);
