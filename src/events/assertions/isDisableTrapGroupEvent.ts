import { BaseEvent, DisableTrapGroupEvent } from "../../types";

export function isDisableTrapGroupEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<DisableTrapGroupEvent> {
  return event.detail.type === 'disabletrapgroup';
}
