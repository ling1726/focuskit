import { UPDATE_TABINDEX_EVENT } from "../../constants";
import { BaseEvent, UpdateTabIndexEvent } from "../../types";

export function isUpdateTabIndexEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<UpdateTabIndexEvent> {
  return event.detail.type === UPDATE_TABINDEX_EVENT;
}
