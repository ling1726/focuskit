import { INIT_EVENT } from "../../constants";
import { BaseEvent, ResetTabIndexesEvent } from "../../types";

export function isResetTabIndexesEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<ResetTabIndexesEvent> {
  return event.detail.type === INIT_EVENT;
}
