import { DIRECTION_FIRST, DIRECTION_LAST, DIRECTION_NEXT, DIRECTION_PREV, LIST, LISTGROUP, UPDATE_TABINDEX_EVENT } from "../constants";
import { DefaultTabbable, DisableListGroupEvent, EnableListGroupEvent, FocusElementEvent, ListOptions, MoveEvent, ResetTabIndexesEvent, UpdateTabIndexEvent } from "../types";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { isClosestEntity } from "../utils/isClosestEntity";
import { isHTMLElement } from "../utils/isHTMLElement";
import { Base } from "./Base";

export class ListGroup extends Base {
  active: boolean = false;

  private _resetOnBlur: boolean;
  private _axis: 'horizontal' | 'vertical' | 'both';
  private _keyHandlers: Record<string, (e: KeyboardEvent) => void> = {};
  private _defaultTabbable: DefaultTabbable;

  constructor(element: HTMLElement, options: ListOptions) {
    const { resetOnBlur, axis = 'both', defaultTabbable = null } = options;
    super(element, options);

    this._defaultTabbable = defaultTabbable;
    this._axis = axis;
    this._resetOnBlur = !!resetOnBlur;

    this.element.addEventListener('keydown', this._onKeyDown);
    this.element.addEventListener('focusout', this._onFocusOut);
    this.element.addEventListener('focusin', this._onFocusIn);

    this._registerKeys();
    this._resetTabIndexes();
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

  private _focus(direction: MoveEvent['direction']) {
    if (!this.active) {
      return;
    }

    const detail: MoveEvent = {
      entity: LISTGROUP,
      id: this.id,
      type: 'move',
      direction,
    }

    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  private _onFocusIn = (e: FocusEvent) => {
    const { target, relatedTarget } = e;

    if (!isClosestEntity(this.element, target)) {
      return;
    }

    if (!isHTMLElement(target) || !isHTMLElement(relatedTarget)) {
      return;
    }

    if (!this.element.contains(relatedTarget)) {
      return;
    }

    const detail: UpdateTabIndexEvent = {
      entity: LIST,
      id: this.id,
      prev: relatedTarget,
      type: UPDATE_TABINDEX_EVENT,
    }

    const event = createFocusKitEvent(detail);
    this.element.dispatchEvent(event);
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
    const detail: ResetTabIndexesEvent = {
      entity: LIST,
      id: this.id,
      type: 'resettabindexes',
      defaultTabbable: this._defaultTabbable,
    }

    const event = createFocusKitEvent(detail);
    this.element.dispatchEvent(event);
  }

  private _registerKeys() {
    this._keyHandlers['ArrowUp'] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers['ArrowDown'] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers['ArrowLeft'] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers['ArrowRight'] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers['Home'] = () => this._focus(DIRECTION_FIRST);
    this._keyHandlers['End'] = () => this._focus(DIRECTION_LAST);
    this._keyHandlers['Enter'] = () => this.enable();
    this._keyHandlers['Escape'] = () => {
      this.disable();
      this.focusElement();
    };

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