import { FocusKitEventHandler } from "../types";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { isUpdateTabIndexEvent } from "./assertions/isUpdateTabIndexEvent";

export const updateTabIndex: FocusKitEventHandler = (event, _state, next) => {
  if (!isUpdateTabIndexEvent(event)) {
    next();
    return;
  }

  const { tabindex, element } = event.detail;

  if (tabindex === "focusable") {
    makeFocusable(element);
  } else {
    makeTabbable(element);
  }
};
