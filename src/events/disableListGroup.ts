import { LISTGROUP } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isDisableListGroupEvent } from "./assertions/isDisableListGroupEvent";

export const disableListGroup: FocusKitEventHandler = (event, state, next) => {
  if (!isDisableListGroupEvent(event) || event.detail.entity !== LISTGROUP) {
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

  makeTabbable(target);

  next();
}
