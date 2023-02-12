import { TRAPGROUP } from "../constants";
import { DisableTrapGroupEvent, EnableTrapGroupEvent, EntityId, FocusElementEvent, ResetTabIndexesEvent } from "../types";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { isFocusable } from "../utils/isFocusable";
import { Trap } from "./Trap";

export class TrapGroup extends Trap {
  constructor(element: HTMLElement, options: { id: EntityId }) {
    if (!isFocusable(element)) {
      throw new Error('TrapGroup element must be focusable');
    }

    super(element, options);

    this.element.addEventListener('keydown', this._onKeyDown);
    this.resetTabIndexes();
  }

  resetTabIndexes() {
    const detail: ResetTabIndexesEvent = {
      entity: TRAPGROUP,
      id: this.id,
      type: 'resettabindexes',
      defaultTabbable: null,
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);

  }

  disable() {
    super.disable();
    const detail: DisableTrapGroupEvent = {
      entity: TRAPGROUP,
      id: this.id,
      type: 'disabletrapgroup',
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  enable() {
    super.enable();
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
      entity: 'trap',
      id: this.id,
      type: 'focuselement',
      target: this.element,
    }
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }
}