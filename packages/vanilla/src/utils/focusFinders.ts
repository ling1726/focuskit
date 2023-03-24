import { HTMLElementWalker } from "./HTMLElementWalker";
import { allFocusable, tabbable } from "./nodeFilters";

const elementWalker = new HTMLElementWalker(document.body);

export function findFirstFocusable(container: HTMLElement) {
  elementWalker.root = container;
  return elementWalker.firstChild(allFocusable);
}

export function findPrevFocusable(
  container: HTMLElement,
  current: HTMLElement
) {
  elementWalker.root = container;
  elementWalker.currentElement = current;
  return elementWalker.previousElement(allFocusable);
}

export function findNextFocusable(
  container: HTMLElement,
  current: HTMLElement
) {
  elementWalker.root = container;
  elementWalker.currentElement = current;
  return elementWalker.nextElement(allFocusable);
}

export function findLastFocusable(container: HTMLElement) {
  elementWalker.root = container;
  return elementWalker.lastChild(allFocusable);
}

export function findAllFocusable(
  container: HTMLElement,
  filter: (element: HTMLElement) => boolean
) {
  const focusable: HTMLElement[] = [];
  elementWalker.root = container;
  let cur = elementWalker.nextElement(allFocusable);
  while (cur) {
    if (filter(cur)) {
      focusable.push(cur);
    }
    cur = elementWalker.nextElement(allFocusable);
  }

  return focusable;
}

export function findFirstTabbable(container: HTMLElement) {
  elementWalker.root = container;
  return elementWalker.firstChild(tabbable);
}

export function findLastTabbable(container: HTMLElement) {
  elementWalker.root = container;
  return elementWalker.lastChild(tabbable);
}
