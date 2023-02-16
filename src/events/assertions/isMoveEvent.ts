import { events } from "../../constants";
import { BaseEvent, MoveEvent } from "../../types";

export function isMoveEvent(event: BaseEvent): event is MoveEvent {
  return event.type === events.MOVE_EVENT;
}
