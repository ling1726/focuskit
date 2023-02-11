import { DIRECTION_FIRST, DIRECTION_LAST, DIRECTION_NEXT, DIRECTION_PREV, FOCUS_KIT_ATTR, LIST } from "../constants";
import { List as IList, InitEvent, EntityId, ListOptions, MoveEvent } from "../types";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { isClosestEntity } from "../utils/isClosestEntity";
import { isHTMLElement } from "../utils/isHTMLElement";

export class List implements IList {
  element: HTMLElement;
  id: EntityId;

  private _resetOnBlur: boolean;
  private _axis: 'horizontal' | 'vertical' | 'both';
  private _keyHandlers: Record<string, (e: KeyboardEvent) => void> = {};

  constructor(element: HTMLElement, options: ListOptions) {
    const { id, resetOnBlur, axis = 'both' } = options;

    this.element = element;
    this._axis = axis;
    this._resetOnBlur = !!resetOnBlur;
    this.id = id;
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
    this.element.addEventListener('keydown', this._onKeyDown);
    this.element.addEventListener('focusout', this._onFocusOut);
    this._registerKeys();
    this._resetTabIndexes();
  }

  private _registerKeys() {
    this._keyHandlers['ArrowUp'] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers['ArrowDown'] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers['ArrowLeft'] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers['ArrowRight'] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers['Home'] = () => this._focus(DIRECTION_FIRST);
    this._keyHandlers['End'] = () => this._focus(DIRECTION_LAST);

    switch (this._axis) {
      case "horizontal":
        delete this._keyHandlers['ArrowUp'];
        delete this._keyHandlers['ArrowDown'];
        break;
      case "vertical":
        delete this._keyHandlers['ArrowLeft'];
        delete this._keyHandlers['ArrowRight'];
        break;
      default:
    }
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

    const event = createFocusKitEvent(detail);
    this.element.dispatchEvent(event);
  }

  private _focus(direction: MoveEvent['direction']) {
    const detail: MoveEvent = {
      entity: LIST,
      id: this.id,
      type: 'move',
      direction,
    }

    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (!isClosestEntity(this.element, e.target)) {
      return;
    }

    if (e.key in this._keyHandlers) {
      this._keyHandlers[e.key](e);
      e.preventDefault();
    }
  }
}