import { HTMLElementFilter, IHTMLElementWalker } from "../types";
import { isHTMLElement } from "./isHTMLElement";

export class HTMLElementWalker implements IHTMLElementWalker {
  public filter: HTMLElementFilter;
  public root: HTMLElement;

  private _treeWalker: TreeWalker;
  private _nodeFilter: NodeFilter;

  constructor(root: HTMLElement, elementfilter: HTMLElementFilter) {
    this.filter = elementfilter;
    this.root = root;
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

  firstChild(): HTMLElement | null {
    const firstChild = this._treeWalker.firstChild();
    if (isHTMLElement(firstChild)) {
      return firstChild;
    }

    return null;
  }

  lastChild(): HTMLElement | null {
    const lastChild = this._treeWalker.lastChild();
    if (isHTMLElement(lastChild)) {
      return lastChild;
    }

    return null;
  }

  nextElement(): HTMLElement | null {
    const nextNode = this._treeWalker.nextNode();
    if (isHTMLElement(nextNode)) {
      return nextNode;
    }

    return null;
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
    if (isHTMLElement(previousNode)) {
      return previousNode;
    }

    return null;
  }

  nextSibling(): HTMLElement | null {
    const nextSibling  = this._treeWalker.nextSibling();
    if (isHTMLElement(nextSibling)) {
      return nextSibling;
    }

    return null;
  }


  previousSibling(): HTMLElement | null {
    const previousSibling  = this._treeWalker.previousSibling();
    if (isHTMLElement(previousSibling)) {
      return previousSibling;
    }

    return null;
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
}