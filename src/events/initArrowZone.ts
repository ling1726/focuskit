import { ARROWZONE, INIT_EVENT } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { allFocusable } from "../utils/nodeFilters";
import { isInitEvent } from "./assertions/isInitEvent";

export const initArrowZone: FocusKitEventHandler = (event, state, next) => {
  if (!isInitEvent(event) || event.detail.entity !== ARROWZONE) {
    next();
    return;
  }

  const target = event.target;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.currentElement = target;
  elementWalker.filter = allFocusable;

  let cur: HTMLElement | null = elementWalker.nextElement();

  if (cur) {
    makeTabbable(cur)
  }

  while (cur = elementWalker.nextElement()) {
    if (!(cur instanceof HTMLElement)) {
      return;
    }

    makeFocusable(cur);
  }

  next();
}
