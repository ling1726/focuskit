import { DIRECTION_PREV  } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const movePrev: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.detail.direction !== DIRECTION_PREV) {
    next();
    return;
  }

  const target = event.target;
  const { activeElement, elementWalker } = state;
  if (!isHTMLElement(target) || !isHTMLElement(activeElement) || !target.contains(activeElement)) {
    next();
    return
  }


  elementWalker.currentElement = activeElement;
  const filter = currentEntityFocusable(target);
  elementWalker.filter = filter;
  const nextFocused = elementWalker.previousElement() ?? elementWalker.lastChild();

  if (nextFocused) {
    nextFocused.focus();
    makeFocusable(activeElement);
    makeTabbable(nextFocused);
  }
}
