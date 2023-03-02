import { HTMLElementWalker } from "./HTMLElementWalker";
import { allFocusable, tabbable } from "./nodeFilters";

const elementWalker = new HTMLElementWalker(document.body);

export function findFirstFocusable(container: HTMLElement) {
  elementWalker.root = container;
  elementWalker.filter = allFocusable;
  return elementWalker.firstChild();
}

export function findPrevFocusable(
  container: HTMLElement,
  current: HTMLElement
) {
  elementWalker.root = container;
  elementWalker.currentElement = current;
  elementWalker.filter = allFocusable;
  return elementWalker.previousElement();
}

export function findNextFocusable(
  container: HTMLElement,
  current: HTMLElement
) {
  elementWalker.root = container;
  elementWalker.currentElement = current;
  elementWalker.filter = allFocusable;
  return elementWalker.nextElement();
}

export function findLastFocusable(container: HTMLElement) {
  elementWalker.root = container;
  elementWalker.filter = allFocusable;
  return elementWalker.lastChild();
}

export function findAllFocusable(
  container: HTMLElement,
  filter: (element: HTMLElement) => boolean
) {
  const focusable: HTMLElement[] = [];
  elementWalker.root = container;
  elementWalker.filter = allFocusable;
  let cur = elementWalker.nextElement();
  while (cur) {
    if (filter(cur)) {
      focusable.push(cur);
    }
    cur = elementWalker.nextElement();
  }

  return focusable;
}

export function findFirstTabbable(container: HTMLElement) {
  elementWalker.root = container;
  elementWalker.filter = tabbable;
  return elementWalker.firstChild();
}

export function findLastTabbable(container: HTMLElement) {
  elementWalker.root = container;
  elementWalker.filter = tabbable;
  return elementWalker.lastChild();
}
