import { DIRECTION_FIRST, DIRECTION_LAST, DIRECTION_NEXT, DIRECTION_PREV, FOCUSKIT_EVENT, FOCUS_KIT_ATTR, LIST } from "../constants";
import { List as IList, InitEvent, EntityId, ListOptions, MoveEvent } from "../types";
import { isClosestEntity } from "../utils/isClosestEntity";
import { isHTMLElement } from "../utils/isHTMLElement";

export class List implements IList {
  element: HTMLElement;
  id: EntityId;

  private _resetOnBlur: boolean;

  constructor(element: HTMLElement, options: ListOptions) {
    const { id, resetOnBlur } = options;

    this.element = element;
    this._resetOnBlur = !!resetOnBlur;
    this.id = id;
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
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
      entity: LIST,
      id: this.id,
      type: 'init',
    }
    const event = new CustomEvent<InitEvent>(FOCUSKIT_EVENT, { detail, bubbles: true, cancelable: true });

    this.element.dispatchEvent(event);
  }

  private _focus(direction: MoveEvent['direction']) {
    const detail: MoveEvent = {
      entity: LIST,
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
      case 'ArrowDown':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        break;
      default:
        return;
    }

    if (!isClosestEntity(this.element, e.target)) {
      return;
    }

    e.preventDefault();

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