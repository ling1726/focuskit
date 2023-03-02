import { entities, events } from "../constants";
import { EntityId, FocusElementEvent } from "../types";
import { createFocusGuard } from "../utils/createFocusGuard";
import { Entity } from "./Entity";

export class Trap extends Entity {
  private _lastFocused: HTMLElement;
  private _previousGuard: HTMLElement;
  private _postGuard: HTMLElement;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    const { id } = options;
    super(element, {
      id,
      entity: entities.TRAP,
    });

    this._previousGuard = createFocusGuard();
    this._postGuard = createFocusGuard();
    this._lastFocused = this.element;
  }

  dispose() {
    this._previousGuard.remove();
    this._postGuard.remove();
  }

  protected onActiveChange(): void {
    this.active ? this._enable() : this._disable();
  }

  protected onFocusIn(
    previousElement: HTMLElement | null,
    nextElement: HTMLElement
  ): void {
    this._lastFocused = nextElement;
  }

  protected onFocusOut(
    previousElement: HTMLElement,
    nextElement: HTMLElement | null
  ): void {
    if (!this.active) {
      return;
    }

    if (!nextElement) {
      this._focusLastFocused();
      return;
    }

    if (this.element.contains(nextElement)) {
      return;
    }

    if (
      nextElement === this._previousGuard ||
      nextElement === this._postGuard
    ) {
      let strategy: "first" | "last" = "first";
      if (nextElement === this._previousGuard) {
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

    parentElement.insertBefore(this._previousGuard, this.element);
    parentElement.insertBefore(this._postGuard, this.element.nextSibling);

    if (!this.element.contains(document.activeElement)) {
      this._focusWithStrategy("first");
    }
  }

  private _disable() {
    this._previousGuard.remove();
    this._postGuard.remove();
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
