import { entities, events } from "../constants";
import { EntityId, FocusElementEvent } from "../types";
import { createFocusGuard } from "../utils/createFocusGuard";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { isHTMLElement } from "../utils/isHTMLElement";
import { Base } from "./Base";

export class Trap extends Base {
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
    if (!isHTMLElement(next)) {
      return;
    }

    this._lastFocused = next;
  }

  protected _onFocusOut(_prev: HTMLElement, next: HTMLElement | null): void {
    if (!isHTMLElement(next)) {
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
    const detail: FocusElementEvent = {
      entity: this.entity,
      id: this.id,
      type: events.FOCUS_ELEMENT,
      strategy,
    };
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  private _focusLastFocused() {
    if (!this._lastFocused) {
      this._focusWithStrategy("first");
      return;
    }

    const detail: FocusElementEvent = {
      entity: this.entity,
      id: this.id,
      type: events.FOCUS_ELEMENT,
      element: this._lastFocused,
    };
    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }
}
