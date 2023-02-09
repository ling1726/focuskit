export function isHTMLElement(node: unknown | null | undefined): node is HTMLElement {
  if (!node) {
    return false;
  }

  return node instanceof HTMLElement;
}