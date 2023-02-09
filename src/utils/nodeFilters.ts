import { HTMLElementFilter } from "../types";

export const allFocusable: HTMLElementFilter = element => {
  if (element.tabIndex >= 0 || element.hasAttribute('tabindex')) {
    return NodeFilter.FILTER_ACCEPT;
  }

  return NodeFilter.FILTER_SKIP;
}