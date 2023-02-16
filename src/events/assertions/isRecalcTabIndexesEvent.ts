import { RECALC_TABINDEXES } from "../../constants";
import { BaseEvent, RecalcTabIndexesEvent } from "../../types";

export function isRecalcTabIndexesEvent(
  event: BaseEvent
): event is RecalcTabIndexesEvent {
  return event.type === RECALC_TABINDEXES;
}
