import { FOCUSKIT_EVENT, FOCUS_KIT_ATTR } from "../constants";
import { EntityId, FocusElementEvent } from "../types";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";
import { isHTMLElement } from "../utils/isHTMLElement";
import { allFocusable } from "../utils/nodeFilters";
import { isAfter, isBefore } from "../utils/nodePosition";

const guardStyles = {
  width: '1px',
  height: '0px',
  padding: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: '1px',
  left: '1px',
};


export class Trap {
  public element: HTMLElement;
  public id: EntityId;
  public active: boolean = false;

  private _lastFocused: HTMLElement;
  private _pre: HTMLElement;
  private _post: HTMLElement;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    const { id } = options;
    this.element = element
    this.id = id;
    this.element.addEventListener('focusin', this._onFocusIn, true);
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
    this._pre = this._createGuard();
    this._post = this._createGuard();
    this._lastFocused = this.element;
  }

  enable() {
    const parentElement = this.element.parentElement;
    if (!parentElement) {
      return;
    }

    parentElement.insertBefore(this._pre, this.element);
    parentElement.insertBefore(this._post, this.element.nextSibling);

    this.element.addEventListener('focusout', this._onFocusOut, true);
    this.active = true;

    if (!this.element.contains(document.activeElement)) {
      this._focusWithStrategy('first');
    }

    console.log('enable trap', this.id);
  }

  disable() {
    this.element.removeEventListener('focusout', this._onFocusOut, true);
    this.active = false;
    this._pre.remove();
    this._post.remove();

    console.log('disable trap', this.id);
  }

  private _createGuard() {
    const guard = document.createElement('div');
    guard.tabIndex = 0;
    Object.assign(guard.style, guardStyles);
    return guard;
  }

  private _onFocusOut = (e: FocusEvent) => {
    const relatedTarget = e.relatedTarget;
    if (!isHTMLElement(relatedTarget)) {
      this._focusLastFocused();
      return;
    }

    if (this.element.contains(relatedTarget)) {
      return;
    }

    if (relatedTarget === this._pre || relatedTarget === this._post) {
      let strategy: 'first' | 'last' = 'first';
      if (relatedTarget === this._pre) {
        strategy = 'last';
      }

      this._focusWithStrategy(strategy);
    } else {
      this._focusLastFocused();
    }

  }

  private _onFocusIn = (e: FocusEvent) => {
    const target = e.target;
    if (!isHTMLElement(target)) {
      return;
    }

    this._lastFocused = target;
  }

  protected _focusWithStrategy(strategy: FocusElementEvent['strategy']) {
    const detail: FocusElementEvent = {
      entity: 'trap',
      id: this.id,
      type: 'focuselement',
      strategy,
    }
    const event = new CustomEvent<FocusElementEvent>(FOCUSKIT_EVENT, { detail, bubbles: true, cancelable: true });

    this.element.dispatchEvent(event);
  }

  private _focusLastFocused() {
    if (!this._lastFocused) {
      this._focusWithStrategy('first');
      return;
    }

    const detail: FocusElementEvent = {
      entity: 'trap',
      id: this.id,
      type: 'focuselement',
      target: this._lastFocused,
    }
    const event = new CustomEvent<FocusElementEvent>(FOCUSKIT_EVENT, { detail, bubbles: true, cancelable: true });

    this.element.dispatchEvent(event);
  }
}