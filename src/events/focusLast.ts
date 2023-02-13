import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { tabbable } from "../utils/nodeFilters";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusLast: FocusKitEventHandler = (event, state, next) => {
  if (!isFocusElementEvent(event) || event.detail.strategy !== 'last') {
    next();
    return;
  }

  const target = event.target;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.currentElement = target;
  elementWalker.filter = tabbable;

  const nextFocused = elementWalker.lastChild();
  nextFocused?.focus();
}

