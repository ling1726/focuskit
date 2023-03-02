import { FOCUSKIT_EVENT } from "../constants";
import { BaseEvent } from "../types";

export function isFocusKitEvent(
  event: Event
): event is CustomEvent<BaseEvent | BaseEvent[]> {
  return event.type === FOCUSKIT_EVENT;
}
