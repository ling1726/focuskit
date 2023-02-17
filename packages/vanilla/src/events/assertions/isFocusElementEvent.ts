import { events } from "../../constants";
import { BaseEvent, FocusElementEvent } from "../../types";

export function isFocusElementEvent(
  event: BaseEvent
): event is FocusElementEvent {
  return event.type === events.FOCUS_ELEMENT;
}
