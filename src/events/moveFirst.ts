import { directions } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const moveFirst: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.direction !== directions.FIRST) {
    next();
    return;
  }

  const { activeElement, elementWalker, target } = state;
  if (
    !isHTMLElement(target) ||
    !isHTMLElement(activeElement) ||
    !target.contains(activeElement)
  ) {
    next();
    return;
  }

  elementWalker.currentElement = target;
  const filter = currentEntityFocusable(target);
  elementWalker.filter = filter;

  const nextFocused = elementWalker.firstChild();
  if (nextFocused) {
    nextFocused.focus();
    makeFocusable(activeElement);
    makeTabbable(nextFocused);
  }
};
