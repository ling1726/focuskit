import { BaseEvent, EnableTrapGroupEvent } from "../../types";

export function isEnableTrapGroupEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<EnableTrapGroupEvent> {
  return event.detail.type === 'enabletrapgroup';
}
