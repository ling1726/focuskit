import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { tabbable } from "../utils/nodeFilters";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusFirst: FocusKitEventHandler = (event, state, next) => {
  if (!isFocusElementEvent(event) || event.detail.entity !== 'trap'|| event.detail.strategy !== 'first') {
    next();
    return;
  }

  const target = event.target;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.currentElement = target as HTMLElement;
  elementWalker.filter = tabbable;

  const nextFocused = elementWalker.nextElement();
  nextFocused?.focus();
}

