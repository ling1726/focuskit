export function assertHTMLElement(
  node: unknown | null | undefined
): asserts node is HTMLElement {
  if (!(node instanceof HTMLElement)) {
    throw new Error("Node is not a HTMLElement");
  }
}
