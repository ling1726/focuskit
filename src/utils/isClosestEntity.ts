import { FOCUS_KIT_ATTR } from "../constants";
import { isHTMLElement } from "./isHTMLElement";

export function isClosestEntity(element: HTMLElement, target: unknown) {
  if (!isHTMLElement(target)) {
    return false;
  }

  if (!element.contains(target)) {
    false;
  }

  let cur = target.parentElement;
  while (isHTMLElement(cur) && element !== cur) {
    if (cur.hasAttribute(FOCUS_KIT_ATTR)) {
      return false;
    }

    cur = cur.parentElement;
  }

  return true;
}