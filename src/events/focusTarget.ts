import { FocusKitEventHandler } from "../types";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusTarget: FocusKitEventHandler = (event, _state, next) => {
  if (!isFocusElementEvent(event) || !event.detail.target) {
    next();
    return;
  }

  event.detail.target?.focus();
};
