import { BaseEvent, EnableListGroupEvent } from "../../types";

export function isEnableListGroupEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<EnableListGroupEvent> {
  return event.detail.type === 'enablelistgroup';
}
