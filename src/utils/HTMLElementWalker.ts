import { HTMLElementFilter, IHTMLElementWalker } from "../types";
import { isHTMLElement } from "./isHTMLElement";

export class HTMLElementWalker implements IHTMLElementWalker {
  public filter: HTMLElementFilter;

  private _treeWalker: TreeWalker;
  private _nodeFilter: NodeFilter;
  private _root: HTMLElement;

  constructor(root: HTMLElement, elementfilter?: HTMLElementFilter) {
    this.filter = elementfilter ?? (() => NodeFilter.FILTER_ACCEPT);
    this._root = root;
    this._nodeFilter = {
      acceptNode: (node: Node) => {
        if (!isHTMLElement(node)) {
          return NodeFilter.FILTER_REJECT;
        }

        return this.filter(node);
      }
    }

    this._treeWalker = document.createTreeWalker(this.root, NodeFilter.SHOW_ELEMENT, this._nodeFilter);
  }

  get root() {
    return this._root;
  }

  set root(val: HTMLElement) {
    this._root = val;
    this._treeWalker.currentNode = this._root;
  }

  firstChild(): HTMLElement | null {
    this._treeWalker.currentNode = this._root;
    const firstChild = this._treeWalker.firstChild();
    if (isHTMLElement(firstChild)) {
      return firstChild;
    }

    return null;
  }

  lastChild(): HTMLElement | null {
    this._treeWalker.currentNode = this._root;
    const lastChild = this._treeWalker.lastChild();
    const nextSibling = this._treeWalker.nextSibling();

    if (!isHTMLElement(lastChild)){
      return null;
    }

    if (!isHTMLElement(nextSibling)) {
      return lastChild;
    } else {
      this._treeWalker.currentNode = nextSibling;
      return this.previousElement();
    }
  }

  nextElement(): HTMLElement | null {
    const nextNode = this._treeWalker.nextNode();
    if (!isHTMLElement(nextNode) || this.isOutsideRoot()) {
      return null;
    }

    return nextNode;
  }

  parentElement(): HTMLElement | null {
    const parentNode = this._treeWalker.parentNode();
    if (isHTMLElement(parentNode)) {
      return parentNode;
    }

    return null;
  }

  previousElement(): HTMLElement | null {
    const previousNode = this._treeWalker.previousNode();
    if (!isHTMLElement(previousNode) || this.isOutsideRoot()) {
      return null;
    }

    return previousNode;
  }

  nextSibling(): HTMLElement | null {
    const nextSibling = this._treeWalker.nextSibling();
    if (!isHTMLElement(nextSibling) || this.isOutsideRoot()) {
      return null;
    }

    return nextSibling;
  }


  previousSibling(): HTMLElement | null {
    const previousSibling = this._treeWalker.previousSibling();
    if (!isHTMLElement(previousSibling) || this.isOutsideRoot()) {
      return null;
    }

    return previousSibling;
  }

  set currentElement(val: HTMLElement) {
    this._treeWalker.currentNode = val;
  }

  get currentElement() {
    const currentNode = this._treeWalker.currentNode;
    if (isHTMLElement(currentNode)) {
      return currentNode;
    }

    console.error('TreeWalker.currentNode is not a HTMLElement, it is', currentNode);
    throw new Error('TreeWalker.currentNode is not a HTMLElement');
  }

  private isOutsideRoot() {
    return !this._root.contains(this.currentElement);
  }
}