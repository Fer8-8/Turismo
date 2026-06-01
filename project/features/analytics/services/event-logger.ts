import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Event, EventLoggerConfig } from "../types/event-logger";

class EventLogger {
  private queue: Event[] = [];
  private readonly isOnline = true;
  private readonly batchSize: number;
  private readonly flushInterval: number;
  private readonly apiUrl: string;
  private readonly enableLogging: boolean;
  private flushIntervalId?: NodeJS.Timeout;
  // private sessionId?: string;

  constructor(config: EventLoggerConfig) {
    this.apiUrl = config.apiUrl;
    this.batchSize = config.batchSize || 10;
    this.flushInterval = config.flushInterval || 30_000;
    this.enableLogging = config.enableLogging ?? true;

    this.initialize();
  }

  private async initialize() {
    try {
      // this.sessionId = `session_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;

      // Monitor network status
      // NetInfo.addEventListener(state => {
      //        this.isOnline = state.isConnected ?? false;
      //        if (this.isOnline) {
      //          this.flushQueue();
      //        }
      //      });

      await this.loadQueue();
      this.flushIntervalId = setInterval(
        () => this.flushQueue(),
        this.flushInterval
      );

      this.log("EventLogger initialized");
    } catch (error) {
      this.log("Failed to track event:", error);
    }
  }

  async track(eventName: string) {
    try {
      const newEvent: Event = {
        userId: "1",
        placeId: "",
        interactionType: "click",
        interactionWeight: 2,
        sessionId: "",
        deviceType: "mobile",
        source: "",
        timeSpentSeconds: 1,
        scrollDepth: 1,
        positionInList: 1,
        recommendationAlgorithm: "",
        createdAt: new Date(),
      };

      this.queue.push(newEvent);
      await this.saveQueue();

      this.log(`Event tracked: ${eventName}`);

      // Flush if batch size reached
      if (this.queue.length >= this.batchSize) {
        await this.flushQueue();
      }
    } catch (error) {
      this.log("Failed to track event:", error);
    }
  }

  async flushQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    const eventsToSend = [...this.queue];

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events: eventsToSend }),
      });

      if (response.ok) {
        // remove sent events from queue
        this.queue = this.queue.slice(eventsToSend.length);
        await this.saveQueue();
        this.log(`Successfully sent ${eventsToSend.length} events`);
      }
    } catch (error) {
      this.log("Network error while sending events:", error);
    }
  }

  private async loadQueue() {
    try {
      const saved = await AsyncStorage.getItem("event_queue");
      if (saved) {
        this.queue = JSON.parse(saved) as Event[];
        this.log(`Loaded ${this.queue.length} events from storage`);
      }
    } catch (error) {
      this.log("Failed to load queue:", error);
    }
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem("event_queue", JSON.stringify(this.queue));
    } catch (error) {
      this.log("Failed to save queue:", error);
    }
  }

  // private async getUserId() {
  //   try {
  //     let userId = await AsyncStorage.getItem("user_id");
  //     if (!userId) {
  //       userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  //       await AsyncStorage.setItem("user_id", userId);
  //     }
  //     return userId;
  //   } catch (error) {
  //     this.log("Failed to get user ID:", error);
  //     return "anonymous";
  //   }
  // }

  async setUserId(userId: string) {
    try {
      await AsyncStorage.setItem("user_id", userId);
      this.log(`User ID set to: ${userId}`);
    } catch (error) {
      this.log("Failed to set user ID:", error);
    }
  }

  async clearQueue() {
    this.queue = [];
    await this.saveQueue();
    this.log("Queue cleared");
  }

  getQueueLength() {
    return this.queue.length;
  }

  destroy() {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId);
    }
    this.log("EventLogger destroyed");
  }

  private log(message: string, data?: Record<string, string>): void {
    if (this.enableLogging) {
      if (data) {
        console.log(`[EventLogger] ${message}`, data);
      } else {
        console.log(`[EventLogger] ${message}`);
      }
    }
  }
}

export const eventLogger = new EventLogger({
  apiUrl: "https://api-endpoint",
  batchSize: 10,
  flushInterval: 30_000,
  enableLogging: false,
});
