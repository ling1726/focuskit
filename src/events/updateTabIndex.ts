import { LIST } from "../constants";
import { FocusKitEventHandler } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { isUpdateTabIndexEvent } from "./assertions/isUpdateTabIndexEvent";

export const updateTabIndex: FocusKitEventHandler = (event, state, next) => {
  if (!isUpdateTabIndexEvent(event) || event.detail.entity !== LIST) {
    next();
    return;
  }

  const target = event.target;
  const { activeElement } = state;
  if (!isHTMLElement(target) || !isHTMLElement(activeElement) || !target.contains(activeElement)) {
    next();
    return
  }

  makeFocusable(event.detail.prev);
  makeTabbable(activeElement);
}
