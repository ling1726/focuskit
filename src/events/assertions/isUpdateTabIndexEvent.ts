import { UPDATE_TABINDEX_EVENT } from "../../constants";
import { BaseEvent, UpdateTabIndexEvent } from "../../types";

export function isUpdateTabIndexEvent(
  event: BaseEvent
): event is UpdateTabIndexEvent {
  return event.type === UPDATE_TABINDEX_EVENT;
}
