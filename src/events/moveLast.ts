import { DIRECTION_LAST } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const moveLast: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.detail.direction !== DIRECTION_LAST) {
    next();
    return;
  }

  const target = event.target;
  const { activeElement, elementWalker } = state;
  if (!isHTMLElement(target) || !isHTMLElement(activeElement) || !target.contains(activeElement)) {
    next();
    return
  }

  elementWalker.currentElement = target.lastElementChild as HTMLElement;
  const filter = currentEntityFocusable(target);
  elementWalker.filter = filter;

  const nextFocused = filter(elementWalker.currentElement) === NodeFilter.FILTER_ACCEPT
    ? elementWalker.currentElement
    : elementWalker.previousElement();
  
  nextFocused?.focus();
}
