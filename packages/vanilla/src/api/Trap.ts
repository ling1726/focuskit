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

  dispose() {
    this._pre.remove();
    this._post.remove();
  }

  protected onActiveChange(): void {
    this.active ? this._enable() : this._disable();
  }

  protected _onFocusIn(_prev: HTMLElement | null, next: HTMLElement): void {
    this._lastFocused = next;
  }

  protected _onFocusOut(_prev: HTMLElement, next: HTMLElement | null): void {
    if (!this.active) {
      return;
    }

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

  private _enable() {
    const parentElement = this.element.parentElement;
    if (!parentElement) {
      return;
    }

    parentElement.insertBefore(this._pre, this.element);
    parentElement.insertBefore(this._post, this.element.nextSibling);

    if (!this.element.contains(document.activeElement)) {
      this._focusWithStrategy("first");
    }
  }

  private _disable() {
    this._pre.remove();
    this._post.remove();
  }

  private _focusWithStrategy(strategy: FocusElementEvent["strategy"]) {
    this.dispatchFocusKitEvent<FocusElementEvent>({
      type: events.FOCUS_ELEMENT,
      strategy,
    });
  }

  private _focusLastFocused() {
    if (!this._lastFocused) {
      this._focusWithStrategy("first");
      return;
    }

    this.dispatchFocusKitEvent<FocusElementEvent>({
      type: events.FOCUS_ELEMENT,
      element: this._lastFocused,
    });
  }
}
