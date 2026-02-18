import type { EventName } from "@/types";

export function track(eventName: EventName, payload: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const event = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Structured logging keeps this easy to swap to a real analytics sink.
  console.info("[analytics]", event);
}
