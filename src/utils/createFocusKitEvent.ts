import { FOCUSKIT_EVENT } from "../constants";
import { BaseEvent } from "../types";

export function createFocusKitEvent<T extends BaseEvent>(detail: T): CustomEvent<T> {
  return new CustomEvent(FOCUSKIT_EVENT, { detail, bubbles: true, cancelable: true });
}