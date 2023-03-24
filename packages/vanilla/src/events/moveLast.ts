import { directions } from "../constants";
import { FocusKitEventHandler } from "../types";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const moveLast: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.direction !== directions.LAST) {
    next();
    return;
  }

  const { target, activeElement, elementWalker } = state;
  if (!activeElement || !target.contains(activeElement)) {
    next();
    return;
  }

  elementWalker.currentElement = target;
  const filter = currentEntityFocusable(target);
  const nextFocused = elementWalker.lastElement(filter);
  if (nextFocused) {
    makeFocusable(activeElement);
    makeTabbable(nextFocused);
    nextFocused.focus();
  }
};
