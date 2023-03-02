import { HTMLElementWalker } from "./HTMLElementWalker";

export function ariaHideOthers(...visible: HTMLElement[]) {
  if (!visible.length) {
    return [];
  }

  const hidden: HTMLElement[] = [];
  const elementWalker = new HTMLElementWalker(visible[0].ownerDocument.body);

  while (
    elementWalker.nextElement((element) => {
      if (visible.every((visibleEl) => !element.contains(visibleEl))) {
        element.setAttribute("aria-hidden", "true");
        hidden.push(element);
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_SKIP;
    })
  ) {
    /* noop */
  }

  return hidden;
}
