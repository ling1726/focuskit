import { FOCUSKIT_EVENT, FOCUS_KIT_ATTR } from "../constants";
import {
  BaseEvent,
  EntityCategory,
  EntityId,
  EntityType,
  RecalcTabIndexesEvent,
} from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";

export abstract class Entity {
  element: HTMLElement;
  id: EntityId;
  entity: EntityType;

  protected _active: boolean = false;

  constructor(
    element: HTMLElement,
    options: { id: EntityId; entity: EntityType }
  ) {
    const { id, entity } = options;

    let category: EntityCategory = "group";
    switch (entity) {
      case "List":
        category = "collection";
        break;
    }

    this.element = element;

    this.element._focuskitFlags = {
      active: false,
      entity,
      id,
      category,
    };

    this.id = id;
    this.entity = entity;
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
    this.element.addEventListener("focusin", this._onFocusIn);
    this.element.addEventListener("focusout", this._onFocusOut);
  }

  dispose() {
    this.element.removeEventListener("focusin", this._onFocusIn);
    this.element.removeEventListener("focusout", this._onFocusOut);
    this.element.removeAttribute(FOCUS_KIT_ATTR);
  }

  get active() {
    return this._active;
  }

  set active(value: boolean) {
    if (value === this._active) {
      return;
    }

    this._active = value;

    if (this.element._focuskitFlags) {
      Object.assign(this.element._focuskitFlags, { active: value });
    }

    this.onActiveChange();
  }

  protected abstract onFocusIn(
    prev: HTMLElement | null,
    next: HTMLElement
  ): void;

  protected abstract onFocusOut(
    prev: HTMLElement,
    next: HTMLElement | null
  ): void;

  protected abstract onActiveChange(): void;

  protected dispatchFocusKitEvent<T extends BaseEvent>(
    details: Omit<T, "id" | "entity">
  ): void {
    const event = new CustomEvent<T>(FOCUSKIT_EVENT, {
      cancelable: true,
      bubbles: true,
      detail: {
        id: this.id,
        entity: this.entity,
        ...details,
      } as T,
    });

    this.element.dispatchEvent(event);
  }

  recalcTabIndexes() {
    this.dispatchFocusKitEvent<RecalcTabIndexesEvent>({
      originalTarget: this.element,
      type: "recalctabindexes",
    });
  }

  private _onFocusIn = (event: FocusEvent) => {
    const { target: nextFocused, relatedTarget: prevFocused } = event;
    if (!isHTMLElement(nextFocused) || this.element === nextFocused) {
      return;
    }

    if (
      prevFocused === null ||
      (isHTMLElement(prevFocused) && !this.element.contains(prevFocused))
    ) {
      this.onFocusIn(prevFocused, nextFocused);
    }
  };

  private _onFocusOut = (event: FocusEvent) => {
    const { target: prevFocused, relatedTarget: nextFocused } = event;
    if (!isHTMLElement(prevFocused) || this.element === prevFocused) {
      return;
    }

    if (
      nextFocused === null ||
      (isHTMLElement(nextFocused) && !this.element.contains(nextFocused))
    ) {
      this.onFocusOut(prevFocused, nextFocused);
    }
  };
}
