import { entities, events } from "../constants";
import { EntityId, FocusElementEvent } from "../types";
import { createFocusGuard } from "../utils/createFocusGuard";
import { hasParentEntities } from "../utils/hasParentEntities";
import { isFocusable } from "../utils/isFocusable";
import { Entity } from "./Entity";

export class TrapGroup extends Entity {
  private _lastFocused: HTMLElement;
  private _pre: HTMLElement;
  private _post: HTMLElement;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    if (!isFocusable(element)) {
      throw new Error("TrapGroup element must be focusable");
    }

    super(element, {
      ...options,
      entity: entities.TRAPGROUP,
    });

    this._pre = createFocusGuard();
    this._post = createFocusGuard();
    this._lastFocused = this.element;

    this.element.addEventListener("keydown", this._onKeyDown);
    this.recalcTabIndexes();
  }

  dispose() {
    this.element.removeEventListener("keydown", this._onKeyDown);
  }

  protected onActiveChange(): void {
    this.recalcTabIndexes();
    if (this.active) {
      const parentElement = this.element.parentElement;
      if (!parentElement) {
        return;
      }

      parentElement.insertBefore(this._pre, this.element);
      parentElement.insertBefore(this._post, this.element.nextSibling);

      this._focusWithStrategy("first");
    } else {
      this._pre.remove();
      this._post.remove();

      this._focusElement();
    }
  }

  private _onKeyDown = (event: KeyboardEvent) => {
    if (hasParentEntities(event.target, this.element)) {
      return;
    }

    switch (event.key) {
      case "Enter":
        if (event.target !== event.currentTarget) {
          return;
        }

        this.active = true;
        break;
      case "Escape":
        this.active = false;
    }
  };

  private _focusElement() {
    this.dispatchFocusKitEvent<FocusElementEvent>({
      type: events.FOCUS_ELEMENT,
      element: this.element,
    });
  }

  protected onFocusOut(_prev: HTMLElement, next: HTMLElement | null) {
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

  protected onFocusIn(_prev: HTMLElement | null, next: HTMLElement) {
    this._lastFocused = next;
  }

  protected _focusWithStrategy(strategy: FocusElementEvent["strategy"]) {
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
