import { events } from "../../constants";
import { BaseEvent, RecalcTabIndexesEvent } from "../../types";

export function isRecalcTabIndexesEvent(
  event: BaseEvent
): event is RecalcTabIndexesEvent {
  return event.type === events.RECALC_TABINDEXES;
}
