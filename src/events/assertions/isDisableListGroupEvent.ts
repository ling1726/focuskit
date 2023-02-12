import { BaseEvent, DisableListGroupEvent } from "../../types";

export function isDisableListGroupEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<DisableListGroupEvent> {
  return event.detail.type === 'disablelistgroup';
}
