import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { allFocusable } from "../utils/nodeFilters";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusLast: FocusKitEventHandler = (event, state, next) => {
  if (!isFocusElementEvent(event) || event.detail.entity !== 'trap'|| event.detail.strategy !== 'last') {
    next();
    return;
  }

  const target = event.target;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.currentElement = target.lastElementChild as HTMLElement;
  elementWalker.filter = allFocusable;

  const nextFocused = allFocusable(elementWalker.currentElement) === NodeFilter.FILTER_ACCEPT
    ? elementWalker.currentElement
    : elementWalker.previousElement();

  nextFocused?.focus();
}

