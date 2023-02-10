import { DIRECTION_FIRST, DIRECTION_LAST, DIRECTION_NEXT, DIRECTION_PREV, FOCUSKIT_EVENT } from "../constants";
import { ArrowZone as IArrowZone, InitEvent, EntityId, ArrowZoneOptions, MoveEvent } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";

export class ArrowZone implements IArrowZone {
  element: HTMLElement;
  id: EntityId;

  private _resetOnBlur: boolean;

  constructor(element: HTMLElement, options: ArrowZoneOptions) {
    const { id, resetOnBlur } = options;

    this.element = element;
    this._resetOnBlur = !!resetOnBlur;
    this.id = id;
    this.element.setAttribute('data-zone', this.id.toString());
    this.element.addEventListener('keydown', this._onKeyDown);
    this.element.addEventListener('focusout', this._onFocusOut);
    this._resetTabIndexes();
  }

  private _onFocusOut = (e: FocusEvent) => {
    if (!isHTMLElement(e.relatedTarget)) {
      this._resetTabIndexes();
      return;
    }

    if (!this.element.contains(e.relatedTarget) && this._resetOnBlur) {
      this._resetTabIndexes();
    }

  }

  private _resetTabIndexes() {
    const detail: InitEvent = {
      entity: 'arrowzone',
      id: this.id,
      type: 'init',
    }
    const event = new CustomEvent<InitEvent>(FOCUSKIT_EVENT, { detail, bubbles: true, cancelable: true });

    this.element.dispatchEvent(event);
  }

  private _focus(direction: MoveEvent['direction']) {
    const detail: MoveEvent= {
      entity: 'arrowzone',
      id: this.id,
      type: 'move',
      direction,
    }

    const event = new CustomEvent<MoveEvent>(FOCUSKIT_EVENT, { detail, bubbles: true, cancelable: true });

    this.element.dispatchEvent(event);
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        this._focus(DIRECTION_PREV);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        this._focus(DIRECTION_NEXT);
        break;
      case 'Home':
        this._focus(DIRECTION_FIRST);
        break;
      case 'End':
        this._focus(DIRECTION_LAST);
        break;
      default:
        return;
    }
  }
}