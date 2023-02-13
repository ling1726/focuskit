import { HTMLElementFilter } from "../types";
import { hasParentEntities } from "./hasParentEntities";

export const allFocusable: HTMLElementFilter = element => {
  if (element.tabIndex >= 0 || element.hasAttribute('tabindex')) {
    return NodeFilter.FILTER_ACCEPT;
  }

  return NodeFilter.FILTER_SKIP;
}

export const tabbable: HTMLElementFilter = element => {
  if (element.tabIndex >= 0) {
    return NodeFilter.FILTER_ACCEPT;
  }

  return NodeFilter.FILTER_SKIP;
}

export const currentEntityFocusable: (target: HTMLElement) =>  HTMLElementFilter = target => element => {
  if (target === element) {
    return NodeFilter.FILTER_SKIP;
  }

  if (hasParentEntities(element, target)) {
    return NodeFilter.FILTER_REJECT;
  }

  return allFocusable(element);
}