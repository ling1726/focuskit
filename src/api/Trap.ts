import { entities, events } from "../constants";
import { EntityId, FocusElementEvent } from "../types";
import { createFocusGuard } from "../utils/createFocusGuard";
import { Entity } from "./Entity";

export class Trap extends Entity {
  private _lastFocused: HTMLElement;
  private _pre: HTMLElement;
  private _post: HTMLElement;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    const { id } = options;
    super(element, {
      id,
      entity: entities.TRAP,
    });

    this._pre = createFocusGuard();
    this._post = createFocusGuard();
    this._lastFocused = this.element;
  }

  enable() {
    const parentElement = this.element.parentElement;
    if (!parentElement) {
      return;
    }

    parentElement.insertBefore(this._pre, this.element);
    parentElement.insertBefore(this._post, this.element.nextSibling);

    this.active = true;

    if (!this.element.contains(document.activeElement)) {
      this._focusWithStrategy("first");
    }

    console.log("enable trap", this.id);
  }

  disable() {
    this.active = false;
    this._pre.remove();
    this._post.remove();

    console.log("disable trap", this.id);
  }

  protected onActiveChange(): void {
    throw new Error("Method not implemented.");
  }

  protected _onFocusIn(_prev: HTMLElement | null, next: HTMLElement): void {
    this._lastFocused = next;
  }

  protected _onFocusOut(_prev: HTMLElement, next: HTMLElement | null): void {
    if (!next) {
      this._focusLastFocused();
      return;
    }

    if (this.element.contains(next)) {
      return;
    }

    if (next === this._pre || next === this._post) {
      let strategy: "first" | "last" = "first";
      if (next === this._pre) {
        strategy = "last";
      }

      this._focusWithStrategy(strategy);
    } else {
      this._focusLastFocused();
    }
  }

  protected _focusWithStrategy(strategy: FocusElementEvent["strategy"]) {
    const event = this.createFocusKitEvent<FocusElementEvent>({
      type: events.FOCUS_ELEMENT,
      strategy,
    });

    this.element.dispatchEvent(event);
  }

  private _focusLastFocused() {
    if (!this._lastFocused) {
      this._focusWithStrategy("first");
      return;
    }

    const event = this.createFocusKitEvent<FocusElementEvent>({
      type: events.FOCUS_ELEMENT,
      element: this._lastFocused,
    });

    this.element.dispatchEvent(event);
  }
}
