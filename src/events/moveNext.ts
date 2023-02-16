import { DIRECTION_NEXT } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const moveNext: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.direction !== DIRECTION_NEXT) {
    next();
    return;
  }

  const { target, activeElement, elementWalker } = state;
  if (
    !isHTMLElement(target) ||
    !isHTMLElement(activeElement) ||
    !target.contains(activeElement)
  ) {
    next();
    return;
  }

  elementWalker.currentElement = activeElement;

  elementWalker.filter = currentEntityFocusable(target);
  const nextFocused = elementWalker.nextElement() ?? elementWalker.firstChild();

  if (nextFocused) {
    nextFocused.focus();
    makeTabbable(nextFocused);
    makeFocusable(activeElement);
  }
};
