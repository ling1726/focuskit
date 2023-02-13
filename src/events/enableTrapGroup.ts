import { TRAPGROUP } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
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
  elementWalker.root = target;
  elementWalker.filter = currentEntityFocusable(target);

  let cur: HTMLElement | null = target;

  while (cur = elementWalker.nextElement()) {
    if (!(cur instanceof HTMLElement)) {
      return;
    }

    makeTabbable(cur);
  }

  next();
}
