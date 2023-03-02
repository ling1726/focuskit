import { directions } from "../constants";
import { FocusKitEventHandler } from "../types";
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
  if (!activeElement || !target.contains(activeElement)) {
    next();
    return;
  }

  elementWalker.currentElement = target;

  const nextFocused = elementWalker.firstChild(currentEntityFocusable(target));
  if (nextFocused) {
    nextFocused.focus();
    makeFocusable(activeElement);
    makeTabbable(nextFocused);
  }
};
