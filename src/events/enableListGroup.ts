import { LISTGROUP } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeTabbable } from "../utils/makeTabbable";
import { currentEntityFocusable } from "../utils/nodeFilters";
import { isEnableListGroupEvent } from "./assertions/isEnableListGroupEvent";

export const enableListGroup: FocusKitEventHandler = (event, state, next) => {
  if (!isEnableListGroupEvent(event) || event.detail.entity !== LISTGROUP) {
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
  elementWalker.filter = currentEntityFocusable(target);


  const first = elementWalker.nextElement()
  if (first) {
    makeTabbable(first);
    first.focus();
  }

  next();
}
