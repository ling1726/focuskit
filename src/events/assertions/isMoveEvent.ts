import { MOVE_EVENT } from "../../constants";
import { BaseEvent, MoveEvent } from "../../types";

export function isMoveEvent(event: CustomEvent<BaseEvent>): event is CustomEvent<MoveEvent> {
  return event.detail.type === MOVE_EVENT;
}
