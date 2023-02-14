import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { allFocusable, currentEntityFocusable } from "../utils/nodeFilters";
import { isResetTabIndexesEvent } from "./assertions/isResetTabIndexesEvent";

export const initList: FocusKitEventHandler = (event, state, next) => {
  if (!isResetTabIndexesEvent(event)) {
    next();
    return;
  }

  const { target, detail: { defaultTabbable, all }   } = event;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.filter = all? allFocusable : currentEntityFocusable(target);
  let tabbable = defaultTabbable === 'first' ? elementWalker.firstChild() : defaultTabbable;
  elementWalker.currentElement = target;
  let cur: HTMLElement | null = elementWalker.currentElement;


  while (cur = elementWalker.nextElement()) {
    if (tabbable === cur) {
      makeTabbable(cur);
    } else {
      makeFocusable(cur);
    }
  }

  next();
}
