import { ARROWZONE, DIRECTION_PREV  } from "../constants";
import { FocusKitEventHandler } from "../types";
import { focusNext } from "../utils/focusNext";
import { isHTMLElement } from "../utils/isHTMLElement";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const movePrev: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.detail.entity !== ARROWZONE || event.detail.direction !== DIRECTION_PREV) {
    next();
    return;
  }

  const target = event.target;
  const activeElement = document.activeElement;
  if (!isHTMLElement(target) || !isHTMLElement(activeElement) || !target.contains(activeElement)) {
    next();
    return
  }


  const elementWalker = state.elementWalker;
  elementWalker.currentElement = activeElement;
  const filter = currentEntityFocusable(target);
  elementWalker.filter = filter;
  let nextFocused = elementWalker.previousElement()

  if (!nextFocused) {
    elementWalker.currentElement = target.lastElementChild as HTMLElement;
    nextFocused = filter(elementWalker.currentElement) === NodeFilter.FILTER_ACCEPT
      ? elementWalker.currentElement
      : elementWalker.previousElement();
  }


  focusNext(activeElement, nextFocused);
}
