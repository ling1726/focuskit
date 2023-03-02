import { directions } from "../constants";
import { FocusKitEventHandler } from "../types";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isMoveEvent } from "./assertions/isMoveEvent";

export const moveNext: FocusKitEventHandler = (event, state, next) => {
  if (!isMoveEvent(event) || event.direction !== directions.NEXT) {
    next();
    return;
  }

  const { target, activeElement, elementWalker } = state;
  if (!activeElement || !target.contains(activeElement)) {
    next();
    return;
  }

  elementWalker.currentElement = activeElement;

  const elementFilter = currentEntityFocusable(target);
  const nextFocused =
    elementWalker.nextElement(elementFilter) ??
    elementWalker.firstChild(elementFilter);

  if (nextFocused) {
    nextFocused.focus();
    makeTabbable(nextFocused);
    makeFocusable(activeElement);
  }
};
