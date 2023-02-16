import { directions } from "../constants";
import { FocusKitEventHandler } from "../types";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const movePrev: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.direction !== directions.PREV) {
    next();
    return;
  }

  const { target, activeElement, elementWalker } = state;
  if (!activeElement || !target.contains(activeElement)) {
    next();
    return;
  }

  elementWalker.currentElement = activeElement;
  const filter = currentEntityFocusable(target);
  elementWalker.filter = filter;
  const nextFocused =
    elementWalker.previousElement() ?? elementWalker.lastChild();

  if (nextFocused) {
    nextFocused.focus();
    makeFocusable(activeElement);
    makeTabbable(nextFocused);
  }
};
