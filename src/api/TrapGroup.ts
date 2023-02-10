import { FOCUSKIT_EVENT } from "../constants";
import { EntityId, FocusElementEvent } from "../types";
import { isFocusable } from "../utils/isFocusable";
import { Trap } from "./Trap";

export class TrapGroup extends Trap {
  constructor(element: HTMLElement, options: { id: EntityId }) {
    if (!isFocusable(element)) {
      throw new Error('TrapGroup element must be focusable');
    }

    super(element, options);

    this.element.addEventListener('keydown', this._onKeyDown);
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.target !== this.element) {
      return;
    }

    switch(e.key) {
      case 'Enter':
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
    const event = new CustomEvent<FocusElementEvent>(FOCUSKIT_EVENT, { detail, bubbles: true, cancelable: true });

    this.element.dispatchEvent(event);
  }
}