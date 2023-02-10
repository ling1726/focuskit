import { FOCUSKIT_EVENT, FOCUS_KIT_ATTR } from "../constants";
import { EntityId, FocusElementEvent } from "../types";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";
import { isHTMLElement } from "../utils/isHTMLElement";
import { allFocusable } from "../utils/nodeFilters";
import { isAfter, isBefore } from "../utils/nodePosition";

export class Trap {
  public element: HTMLElement;
  public id: EntityId;
  public active: boolean = false;

  private _lastFocused: HTMLElement | null = null;
  private _elementWalker: HTMLElementWalker;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    const { id } = options;
    this.element = element
    this.id = id;
    this._elementWalker = new HTMLElementWalker(document.body, allFocusable);
    this.element.addEventListener('focusin', this._onFocusIn, true);
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
  }

  enable() {
    this.element.addEventListener('focusout', this._onFocusOut, true);
    this.active = true;

    console.log('enable trap', this.id);
  }

  disable() {
    this.element.removeEventListener('focusout', this._onFocusOut, true);
    this.active = false;

    console.log('disable trap', this.id);
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

    if (!this._lastFocused) {
      this._focusWithStrategy('first');
      return;
    }

    this._elementWalker.currentElement = this._lastFocused;
    let strategy: 'first' | 'last' | undefined = undefined;
    if (isBefore(this.element, relatedTarget) && this._elementWalker.previousElement() === relatedTarget) {
      strategy =  'last';
    }

    if (isAfter(this.element, relatedTarget) && this._elementWalker.nextElement() === relatedTarget) {
      strategy = 'first';
    }

    if (strategy) {
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