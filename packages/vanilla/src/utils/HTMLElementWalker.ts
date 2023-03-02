import { HTMLElementFilter } from "../types";
import { isHTMLElement } from "./isHTMLElement";

export class HTMLElementWalker {
  public filter: HTMLElementFilter;

  private _treeWalker: TreeWalker;
  private _root: HTMLElement;

  constructor(root: HTMLElement, elementFilter?: HTMLElementFilter) {
    this.filter = elementFilter ?? (() => NodeFilter.FILTER_ACCEPT);
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

          return this.filter(node);
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

  firstChild(): HTMLElement | null {
    this._treeWalker.currentNode = this._root;
    return this._treeWalker.firstChild() as HTMLElement | null;
  }

  lastChild(): HTMLElement | null {
    this._treeWalker.currentNode = this._root;
    const lastChild = this._treeWalker.lastChild() as HTMLElement | null;

    if (!lastChild) {
      return null;
    }

    const nextSibling = this._treeWalker.nextSibling() as HTMLElement | null;

    if (!nextSibling) {
      return lastChild;
    } else {
      this._treeWalker.currentNode = nextSibling;
      return this.previousElement();
    }
  }

  nextElement(): HTMLElement | null {
    const nextNode = this._treeWalker.nextNode() as HTMLElement | null;
    if (!nextNode || this.isOutsideRoot()) {
      return null;
    }

    return nextNode;
  }

  parentElement(): HTMLElement | null {
    return this._treeWalker.parentNode() as HTMLElement | null;
  }

  previousElement(): HTMLElement | null {
    const previousNode = this._treeWalker.previousNode() as HTMLElement | null;
    if (!previousNode || this.isOutsideRoot()) {
      return null;
    }

    return previousNode;
  }

  nextSibling(): HTMLElement | null {
    const nextSibling = this._treeWalker.nextSibling() as HTMLElement | null;
    if (!nextSibling || this.isOutsideRoot()) {
      return null;
    }

    return nextSibling;
  }

  previousSibling(): HTMLElement | null {
    const previousSibling =
      this._treeWalker.previousSibling() as HTMLElement | null;
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
