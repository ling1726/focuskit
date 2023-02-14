import { TRAPGROUP } from "../constants";
import { FocusKitEventHandler } from "../types";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";
import { isFocusable } from "../utils/isFocusable";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeTabbable } from "../utils/makeTabbable";
import { allFocusable } from "../utils/nodeFilters";
import { isEnableTrapGroupEvent } from "./assertions/isEnableTrapGroupEvent";

export const enableTrapGroup: FocusKitEventHandler = (event, state, next) => {
  if (!isEnableTrapGroupEvent(event) || event.detail.entity !== TRAPGROUP) {
    next();
    return;
  }

  const target = event.target;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.filter = element => {
    if (element._focuskitFlags?.tabbable === false) {
      const walker = new HTMLElementWalker(element);
      walker.filter = allFocusable;
      const first = walker.nextElement();
      if (first) {
        makeTabbable(first);
      }

      return NodeFilter.FILTER_REJECT;
    }

    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    makeTabbable(element);
    return NodeFilter.FILTER_REJECT;
  }

  while (elementWalker.nextElement()) { }

  next();
}
