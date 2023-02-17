import { directions } from "../constants";
import { FocusKitEventHandler } from "../types";
import { tabbable } from "../utils/nodeFilters";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusLast: FocusKitEventHandler = (event, state, next) => {
  if (!isFocusElementEvent(event) || event.strategy !== directions.LAST) {
    next();
    return;
  }

  const { target } = state;

  const elementWalker = state.elementWalker;
  elementWalker.currentElement = target;
  elementWalker.filter = tabbable;

  const nextFocused = elementWalker.lastChild();
  nextFocused?.focus();
};
