export function isHTMLElement(node: unknown | null | undefined): node is HTMLElement {
  if (!node) {
    return false;
  }

  return node instanceof HTMLElement;
}

export function makeFocusable(el: HTMLElement) {
  el.tabIndex = -1;
}

export function makeTabbable(el: HTMLElement) {
  el.tabIndex = 0;
}

export function containsActiveElement(el: HTMLElement) {
  return el.contains(document.activeElement);
}

export function focusNext(activeElement: HTMLElement, nextFocused: HTMLElement) {
  makeFocusable(activeElement);
  makeTabbable(nextFocused);
  nextFocused.focus();
}

export function isBeforeElement(element: HTMLElement, otherElement: HTMLElement) {
  return element.compareDocumentPosition(otherElement) & Node.DOCUMENT_POSITION_PRECEDING;
}

export function isAfterElement(element: HTMLElement, otherElement: HTMLElement) {
  return element.compareDocumentPosition(otherElement) & Node.DOCUMENT_POSITION_FOLLOWING;
}