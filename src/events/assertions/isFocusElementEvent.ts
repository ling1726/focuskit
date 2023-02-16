import { BaseEvent, FocusElementEvent } from "../../types";

export function isFocusElementEvent(
  event: BaseEvent
): event is FocusElementEvent {
  return event.type === "focuselement";
}
