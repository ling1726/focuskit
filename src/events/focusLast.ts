import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { tabbable } from "../utils/nodeFilters";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusLast: FocusKitEventHandler = (event, state, next) => {
  if (!isFocusElementEvent(event) || event.strategy !== "last") {
    next();
    return;
  }

  const { target } = state;
  if (!isHTMLElement(target)) {
    next();
    return;
  }

  const elementWalker = state.elementWalker;
  elementWalker.currentElement = target;
  elementWalker.filter = tabbable;

  const nextFocused = elementWalker.lastChild();
  nextFocused?.focus();
};
