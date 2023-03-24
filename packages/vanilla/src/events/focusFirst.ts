import { directions } from "../constants";
import { FocusKitEventHandler } from "../types";
import { tabbable } from "../utils/nodeFilters";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusFirst: FocusKitEventHandler = (event, state, next) => {
  if (!isFocusElementEvent(event) || event.strategy !== directions.FIRST) {
    next();
    return;
  }

  const elementWalker = state.elementWalker;

  const nextFocused = elementWalker.firstChild(tabbable);
  nextFocused?.focus();
};
