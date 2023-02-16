export function isTabbable(element: HTMLElement) {
  return element.getAttribute("tabindex") === "0" || element.tabIndex >= 0;
}
