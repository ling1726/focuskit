import { INIT_EVENT } from "../../constants";
import { BaseEvent, InitEvent } from "../../types";

export function isInitEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<InitEvent> {
  return event.detail.type === INIT_EVENT;
}
