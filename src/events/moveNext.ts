import { ARROWZONE, DIRECTION_NEXT } from "../constants";
import { FocusKitEventHandler } from "../types";
import { focusNext } from "../utils/focusNext";
import { isHTMLElement } from "../utils/isHTMLElement";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const moveNext: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.detail.entity !== ARROWZONE || event.detail.direction !== DIRECTION_NEXT) {
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
  elementWalker.filter = currentEntityFocusable(target);
  const nextFocused = elementWalker.nextElement();

  if (nextFocused) {
    focusNext(activeElement, nextFocused);
  } else {
    elementWalker.currentElement = target;
    focusNext(activeElement, elementWalker.nextElement())
  }
}
