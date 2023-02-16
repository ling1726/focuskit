import { events } from "../../constants";
import { BaseEvent, UpdateTabIndexEvent } from "../../types";

export function isUpdateTabIndexEvent(
  event: BaseEvent
): event is UpdateTabIndexEvent {
  return event.type === events.UPDATE_TABINDEX_EVENT;
}
