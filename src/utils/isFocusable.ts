export function isFocusable(element: HTMLElement) {
  return element.hasAttribute('tabindex') || element.tabIndex > 0;
}