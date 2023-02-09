import { makeFocusable } from "./makeFocusable";
import { makeTabbable } from "./makeTabbable";

export function focusNext(activeElement: HTMLElement, nextFocused: HTMLElement | null) {
  if (!nextFocused) {
    return;
  }

  makeFocusable(activeElement);
  makeTabbable(nextFocused);
  nextFocused.focus();
}