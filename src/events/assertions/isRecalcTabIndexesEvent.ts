import { RECALC_TABINDEXES } from "../../constants";
import { BaseEvent, RecalcTabIndexesEvent } from "../../types";

export function isRecalcTabIndexesEvent(
  event: CustomEvent<BaseEvent>
): event is CustomEvent<RecalcTabIndexesEvent> {
  return event.detail.type === RECALC_TABINDEXES;
}
