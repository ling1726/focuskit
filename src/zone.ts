import { ZONE_CREATE_EVENT, ZONE_DISPOSE_EVENT } from "./constants";
import { createTreeWalker } from "./createTreeWalker";
import { FocusableWalker, ZoneCreateEvent, ZoneDisposeEvent, ZoneId, ZoneOptions, Zone as ZoneInterface } from "./types";
import { containsActiveElement, focusNext, isAfterElement, isBeforeElement, isHTMLElement, makeFocusable, makeTabbable } from "./utils";

export class Zone implements ZoneInterface {
  public element: HTMLElement;
  public id: ZoneId;
  public prevZone: ZoneInterface | undefined;
  public nextZone: ZoneInterface | undefined;

  private _treeWalker: FocusableWalker;

  private static counter: number = 0;

  constructor(element: HTMLElement, options: ZoneOptions = {}) {
    const nextCount = Zone.counter++;
    const { id = nextCount } = options;

    this.element = element;
    // @ts-ignore
    this.element._zone = this;
    this.id = id;
    this.element.setAttribute('data-zone', this.id.toString());
    this._treeWalker = createTreeWalker(this.element);
    this._resetTabIndexes();
    this.element.addEventListener('keydown', this._onKeyDown);
    document.addEventListener(ZONE_CREATE_EVENT, this._onZoneCreate as EventListener);
    document.addEventListener(ZONE_DISPOSE_EVENT, this._onZoneDispose as EventListener);
    this._broadcastCreate();
  }

  public dispose() {
    this.element.removeEventListener('keydown', this._onKeyDown);
    this.element.removeEventListener(ZONE_CREATE_EVENT, this._onZoneCreate as EventListener);
    // @ts-ignore
    this.element._zone = undefined;

    this._broadcastDispose();
  }

  private _onZoneCreate = (e: CustomEvent<ZoneCreateEvent>) => {
    const target = e.target;
    const newZone = e.detail.zone;
    if (!isHTMLElement(target) || newZone === this) {
      return;
    }

    if (this.element.contains(target)) {
      // TODO handle nested zones
    }

    const nextZone = this.nextZone;
    if (isAfterElement(this.element, target) && (!nextZone || isBeforeElement(nextZone.element, target))) {
        this.nextZone = newZone;
        newZone.prevZone = this;
    }

    const prevZone = this.prevZone;
    if (isBeforeElement(this.element, target) && (!prevZone || isAfterElement(prevZone.element, target))) {
      this.prevZone = newZone;
      newZone.nextZone = this;
    }
  }

  private _onZoneDispose = (e: CustomEvent<ZoneDisposeEvent>) => {
    const target = e.target;
    const deletedZoneId = e.detail.id;
    if (!isHTMLElement(target)) {
      return;
    }

    const nextZone = this.nextZone;
    if (nextZone?.id === deletedZoneId) {
      this.nextZone = this.nextZone?.nextZone;
      if (this.nextZone) {
        this.nextZone.prevZone = this;
      }
    }

    const prevZone = this.prevZone;
    if (prevZone?.id === deletedZoneId) {
      this.prevZone = this.nextZone?.prevZone;
      if (this.prevZone) {
        this.prevZone.nextZone = this;
      }
    }

  }


  private _broadcastCreate() {
    const event = new CustomEvent<ZoneCreateEvent>(ZONE_CREATE_EVENT, {
      bubbles: true, cancelable: true, detail: {
        zone: this,
      }
    });

    this.element.dispatchEvent(event)
  }

  private _broadcastDispose() {
    const event = new CustomEvent<ZoneDisposeEvent>(ZONE_DISPOSE_EVENT, {
      bubbles: true, cancelable: true, detail: {
        id: this.id,
      }
    });

    this.element.dispatchEvent(event)
  }

  private _resetTabIndexes() {
    let cur = this._treeWalker.first();

    if (cur) {
      makeTabbable(cur)
    }

    while (cur = this._treeWalker.next()) {
      if (!(cur instanceof HTMLElement)) {
        return;
      }

      makeFocusable(cur);
    }
  }

  private _focusNext() {
    if (!containsActiveElement(this.element)) {
      console.error(this.element, 'does not contain the active element');
      return;
    }

    const activeElement = document.activeElement;
    if (!activeElement || !isHTMLElement(activeElement)) {
      return;
    }

    this._treeWalker.setCurrent(activeElement);
    const nextFocused = this._treeWalker.next();

    if (!nextFocused) {
      return;
    }

    focusNext(activeElement, nextFocused);
  }

  private _focusPrev() {
    if (!containsActiveElement(this.element)) {
      console.error(this.element, 'does not contain the active element');
      return;
    }

    const activeElement = document.activeElement;
    if (!activeElement || !isHTMLElement(activeElement)) {
      return;
    }

    this._treeWalker.setCurrent(activeElement);
    const nextFocused = this._treeWalker.prev();

    if (!nextFocused) {
      return;
    }

    focusNext(activeElement, nextFocused);
  }

  private _focusFirst() {
    if (!containsActiveElement(this.element)) {
      console.error(this.element, 'does not contain the active element');
      return;
    }

    const activeElement = document.activeElement;
    if (!activeElement || !isHTMLElement(activeElement)) {
      return;
    }

    const nextFocused = this._treeWalker.first();

    if (!nextFocused) {
      return;
    }

    focusNext(activeElement, nextFocused);
  }

  private _focusLast() {
    if (!containsActiveElement(this.element)) {
      console.error(this.element, 'does not contain the active element');
      return;
    }

    const activeElement = document.activeElement;
    if (!activeElement || !isHTMLElement(activeElement)) {
      return;
    }

    const nextFocused = this._treeWalker.last();

    if (!nextFocused) {
      return;
    }

    focusNext(activeElement, nextFocused);
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        this._focusPrev();
        break;
      case 'ArrowDown':
        this._focusNext();
        break;
      case 'ArrowLeft':
        this._focusPrev();
        break;
      case 'ArrowRight':
        this._focusNext();
        break;
      case 'Home':
        this._focusFirst();
        break;
      case 'End':
        this._focusLast();
        break;
      default:
        return;
    }
  }
}