import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { tabbable } from "../utils/nodeFilters";
import { isFocusElementEvent } from "./assertions/isFocusElementEvent";

export const focusFirst: FocusKitEventHandler = (event, state, next) => {
  if (!isFocusElementEvent(event) || event.strategy !== "first") {
    next();
    return;
  }

  const { target } = state;
  if (!isHTMLElement(target)) {
    next();
    return;
  }

  const elementWalker = state.elementWalker;
  elementWalker.filter = tabbable;

  const nextFocused = elementWalker.firstChild();
  nextFocused?.focus();
};
