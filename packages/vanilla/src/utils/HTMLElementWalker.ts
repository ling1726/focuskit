import { HTMLElementFilter } from "../types";
import { isHTMLElement } from "./isHTMLElement";

function defaultElementFilter() {
  return NodeFilter.FILTER_ACCEPT;
}

export class HTMLElementWalker {
  private _elementFilter: HTMLElementFilter;

  private _treeWalker: TreeWalker;
  private _root: HTMLElement;

  constructor(root: HTMLElement) {
    this._elementFilter = defaultElementFilter;
    this._root = root;

    this._treeWalker = document.createTreeWalker(
      this.root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node: Node) => {
          if (!isHTMLElement(node)) {
            return NodeFilter.FILTER_REJECT;
          }

          if (!this.root.contains(node)) {
            return NodeFilter.FILTER_REJECT;
          }

          return this._elementFilter(node);
        },
      }
    );
  }

  get root() {
    return this._root;
  }

  set root(value: HTMLElement) {
    this._root = value;
    this._treeWalker.currentNode = this._root;
  }

  firstChild(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    this._treeWalker.currentNode = this._root;
    const firstChild = this._treeWalker.firstChild() as HTMLElement | null;
    this._elementFilter = defaultElementFilter;
    return firstChild;
  }

  lastChild(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    this._treeWalker.currentNode = this._root;
    const lastChild = this._treeWalker.lastChild() as HTMLElement | null;
    this._elementFilter = defaultElementFilter;
    return lastChild;
  }

  lastElement(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    this._treeWalker.currentNode = this._root;
    let lastElement: HTMLElement | null = null;
    let nextElement: HTMLElement | null = null;
    while ((nextElement = this._treeWalker.lastChild() as HTMLElement | null)) {
      lastElement = nextElement;
    }
    this._elementFilter = defaultElementFilter;
    return lastElement;
  }

  nextElement(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    const nextNode = this._treeWalker.nextNode() as HTMLElement | null;
    this._elementFilter = defaultElementFilter;
    if (!nextNode || this.isOutsideRoot()) {
      return null;
    }

    return nextNode;
  }

  parentElement(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    const parentElement = this._treeWalker.parentNode() as HTMLElement | null;
    this._elementFilter = defaultElementFilter;
    return parentElement;
  }

  previousElement(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    const previousNode = this._treeWalker.previousNode() as HTMLElement | null;
    this._elementFilter = defaultElementFilter;
    if (!previousNode || this.isOutsideRoot()) {
      return null;
    }

    return previousNode;
  }

  nextSibling(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    const nextSibling = this._treeWalker.nextSibling() as HTMLElement | null;
    this._elementFilter = defaultElementFilter;
    if (!nextSibling || this.isOutsideRoot()) {
      return null;
    }

    return nextSibling;
  }

  previousSibling(
    elementFilter: HTMLElementFilter = defaultElementFilter
  ): HTMLElement | null {
    this._elementFilter = elementFilter;
    const previousSibling =
      this._treeWalker.previousSibling() as HTMLElement | null;
    this._elementFilter = defaultElementFilter;
    if (!previousSibling || this.isOutsideRoot()) {
      return null;
    }

    return previousSibling;
  }

  set currentElement(value: HTMLElement) {
    this._treeWalker.currentNode = value;
  }

  get currentElement() {
    return this._treeWalker.currentNode as HTMLElement;
  }

  private isOutsideRoot() {
    return !this._root.contains(this.currentElement);
  }
}
