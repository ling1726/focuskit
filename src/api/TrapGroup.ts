import { TRAPGROUP } from "../constants";
import { EnableTrapGroupEvent, EntityId, FocusElementEvent, ResetTabIndexesEvent } from "../types";
import { creaetFocusGuard } from "../utils/createFocusGuard";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { isFocusable } from "../utils/isFocusable";
import { isHTMLElement } from "../utils/isHTMLElement";
import { Base } from "./Base";

export class TrapGroup extends Base {
  active: boolean = false;

  private _lastFocused: HTMLElement;
  private _pre: HTMLElement;
  private _post: HTMLElement;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    if (!isFocusable(element)) {
      throw new Error('TrapGroup element must be focusable');
    }

    super(element, { ...options, entity: TRAPGROUP, flags: { tabbable: true } });

    this.element.addEventListener('focusin', this._onFocusIn, true);
    this._pre = creaetFocusGuard();
    this._post = creaetFocusGuard();
    this._lastFocused = this.element;

    this.element.addEventListener('keydown', this._onKeyDown);
    this.resetTabIndexes();
  }

  resetTabIndexes() {
    const detail: ResetTabIndexesEvent = {
      entity: TRAPGROUP,
      id: this.id,
      type: 'resettabindexes',
      defaultTabbable: null,
      all: true,
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);

  }

  disable() {
    this.element.removeEventListener('focusout', this._onFocusOut, true);
    this.active = false;
    this._pre.remove();
    this._post.remove();

    this.resetTabIndexes();
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

    const detail: EnableTrapGroupEvent = {
      entity: TRAPGROUP,
      id: this.id,
      type: 'enabletrapgroup',
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (e.target !== e.currentTarget) {
          return;
        }

        this.enable();
        this._focusWithStrategy('first');
        break;
      case 'Escape':
        this.disable();
        this._focusElement();
    }
  }

  private _focusElement() {
    const detail: FocusElementEvent = {
      entity: TRAPGROUP,
      id: this.id,
      type: 'focuselement',
      target: this.element,
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
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
      entity: TRAPGROUP,
      id: this.id,
      type: 'focuselement',
      strategy,
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  private _focusLastFocused() {
    if (!this._lastFocused) {
      this._focusWithStrategy('first');
      return;
    }

    const detail: FocusElementEvent = {
      entity: TRAPGROUP,
      id: this.id,
      type: 'focuselement',
      target: this._lastFocused,
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }
}