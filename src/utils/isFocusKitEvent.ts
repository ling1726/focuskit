import { FOCUSKIT_EVENT } from "../constants";
import { BaseEvent } from "../types";

export function isFocusKitEvent(
  e: Event
): e is CustomEvent<BaseEvent | [BaseEvent]> {
  return e.type === FOCUSKIT_EVENT;
}
