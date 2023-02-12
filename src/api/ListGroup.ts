import { FOCUSKIT_EVENT, LIST, LISTGROUP } from "../constants";
import { isFocusElementEvent } from "../events/assertions/isFocusElementEvent";
import { DisableListGroupEvent, EnableListGroupEvent, FocusElementEvent, ListOptions } from "../types";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { isClosestEntity } from "../utils/isClosestEntity";
import { isFocusKitEvent } from "../utils/isFocusKitEvent";
import { List } from "./List";

export class ListGroup extends List {
  active: boolean = false;

  constructor(element: HTMLElement, options: ListOptions) {
    super(element, { ...options, defaultTabbable: null });
    this.element.addEventListener('keydown', this._onKeyDown);
    this.element.addEventListener(FOCUSKIT_EVENT, e => {
      if (!isFocusKitEvent(e) || !isFocusElementEvent) {
        return;
      } 

      if (e.detail.entity === LIST && !this.active) {
        e.preventDefault();
      }
    })
  }

  enable() {
    this.active = true;
    const details: EnableListGroupEvent = {
      entity: LISTGROUP,
      id: this.id,
      type: 'enablelistgroup',
    }

    this.element.dispatchEvent(createFocusKitEvent(details));
  }

  disable() {
    this.active = false;
    const details: DisableListGroupEvent = {
      entity: LISTGROUP,
      id: this.id,
      type: 'disablelistgroup',
    }

    this.element.dispatchEvent(createFocusKitEvent(details));
  }

  focusElement() {
    const details: FocusElementEvent = {
      entity: LISTGROUP,
      id: this.id,
      type: 'focuselement',
      target: this.element,
    }

    this.element.dispatchEvent(createFocusKitEvent(details));
  }

  protected _onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (!isClosestEntity(this.element, e.target)) {
      return;
    }

    if (this.active && e.key in this._keyHandlers) {
      this._keyHandlers[e.key](e);
      e.preventDefault();
    }

    switch(e.key) {
      case 'Enter':
        this.enable()
        break;
      case 'Escape':
        this.disable();
        this.focusElement();
        break;
    }

  }

}