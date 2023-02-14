import { TRAPGROUP } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isDisableTrapGroupEvent } from "./assertions/isDisableTrapGroupEvent";

export const disableTrapGroup: FocusKitEventHandler = (event, state, next) => {
  if (!isDisableTrapGroupEvent(event) || event.detail.entity !== TRAPGROUP) {
    next();
    return;
  }

  const target = event.target;
  if (!isHTMLElement(target)) {
    next();
    return
  }

  const elementWalker = state.elementWalker;
  elementWalker.filter = currentEntityFocusable(target);

  let cur: HTMLElement | null = target;

  while (cur = elementWalker.nextElement()) {
    if (!(cur instanceof HTMLElement)) {
      return;
    }

    makeFocusable(cur);
  }

  // TODO test this
  makeTabbable(target);

  next();
}
