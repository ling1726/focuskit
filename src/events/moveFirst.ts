import { LIST, DIRECTION_FIRST } from "../constants";
import { FocusKitEventHandler } from "../types";
import { focusNext } from "../utils/focusNext";
import { isHTMLElement } from "../utils/isHTMLElement";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const moveFirst: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.detail.entity !== LIST || event.detail.direction !== DIRECTION_FIRST) {
    next();
    return;
  }

  const { activeElement, elementWalker } = state;
  const target = event.target;
  if (!isHTMLElement(target) || !isHTMLElement(activeElement) || !target.contains(activeElement)) {
    next();
    return
  }

  elementWalker.currentElement = target.firstElementChild as HTMLElement;
  const filter = currentEntityFocusable(target);
  elementWalker.filter = filter;

  const nextFocused = filter(elementWalker.currentElement) === NodeFilter.FILTER_ACCEPT
    ? elementWalker.currentElement
    : elementWalker.nextElement();
  
  focusNext(activeElement, nextFocused);
}

