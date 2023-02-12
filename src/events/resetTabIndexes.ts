import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isResetTabIndexesEvent } from "./assertions/isResetTabIndexesEvent";

export const initList: FocusKitEventHandler = (event, state, next) => {
  if (!isResetTabIndexesEvent(event)) {
    next();
    return;
  }

  const { target, detail: { defaultTabbable }   } = event;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.currentElement = target;
  elementWalker.filter = currentEntityFocusable(target);

  let cur: HTMLElement | null = elementWalker.nextElement();

  if (cur) {
    if (defaultTabbable === 'first') {
      makeTabbable(cur);
    } else {
      elementWalker.currentElement = target;
    }
  }

  while (cur = elementWalker.nextElement()) {
    if (!(cur instanceof HTMLElement)) {
      return;
    }

    makeFocusable(cur);
  }

  next();
}
