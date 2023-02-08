import { FocusableWalker } from "./types";
import { isHTMLElement } from "./utils";

export function createTreeWalker(root: HTMLElement): FocusableWalker {
  const acceptNode: NodeFilter = (element) => {
    if (!(element instanceof HTMLElement)) {
      return NodeFilter.FILTER_REJECT;
    }

    if (element.hasAttribute('aria-hidden')) {
      return NodeFilter.FILTER_REJECT;
    }

    if (element.tabIndex >= 0 || element.hasAttribute('tabindex')) {
      return NodeFilter.FILTER_ACCEPT;
    }

    return NodeFilter.FILTER_SKIP;
  }

  const treewalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode });

  const next = () => {
    let cur = treewalker.nextNode();
    while(cur !== null && !isHTMLElement(cur)) {
      cur = treewalker.nextNode();
    }

    return cur;
  }

  const prev = () => {
    let cur = treewalker.previousNode();
    while(cur !== null && !isHTMLElement(cur)) {
      cur = treewalker.nextNode();
    }

    return cur;
  }

  const first = () => {
    treewalker.currentNode = treewalker.root;
    const firstChild = treewalker.firstChild();

    if (isHTMLElement(firstChild)) {
      return firstChild;
    }

    return null;
  }

  const last = () => {
    treewalker.currentNode = treewalker.root;
    const firstChild = treewalker.lastChild();

    if (isHTMLElement(firstChild)) {
      return firstChild;
    }

    return null;
  }

  return {
    next,
    prev,
    setCurrent: (el: HTMLElement) => treewalker.currentNode = el,
    first,
    last,
  }
}