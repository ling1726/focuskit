import { BaseEvent, FocusElementEvent } from "../../types";

export function isFocusElementEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<FocusElementEvent> {
  return event.detail.type === 'focuselement';
}
