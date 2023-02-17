export function isBefore(element: HTMLElement, otherElement: HTMLElement) {
  return (
    element.compareDocumentPosition(otherElement) &
    Node.DOCUMENT_POSITION_PRECEDING
  );
}

export function isAfter(element: HTMLElement, otherElement: HTMLElement) {
  return (
    element.compareDocumentPosition(otherElement) &
    Node.DOCUMENT_POSITION_FOLLOWING
  );
}
