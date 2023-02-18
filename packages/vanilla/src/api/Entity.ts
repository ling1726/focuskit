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
    this.element.addEventListener("focusin", this._onFocusInBase);
    this.element.addEventListener("focusout", this._onFocusOutBase);
  }

  dispose() {
    this.element.removeEventListener("focusin", this._onFocusInBase);
    this.element.removeEventListener("focusout", this._onFocusOutBase);
    this.element.removeAttribute(FOCUS_KIT_ATTR);
  }

  get active() {
    return this._active;
  }

  set active(val: boolean) {
    if (val === this._active) {
      return;
    }

    this._active = val;

    if (this.element._focuskitFlags) {
      Object.assign(this.element._focuskitFlags, { active: val });
    }

    this.onActiveChange();
  }

  protected abstract _onFocusIn(
    prev: HTMLElement | null,
    next: HTMLElement
  ): void;

  protected abstract _onFocusOut(
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
      // @ts-ignore
      detail: {
        id: this.id,
        entity: this.entity,
        ...details,
      },
    });

    this.element.dispatchEvent(event);
  }

  recalcTabIndexes() {
    this.dispatchFocusKitEvent<RecalcTabIndexesEvent>({
      originalTarget: this.element,
      type: "recalctabindexes",
    });
  }

  private _onFocusInBase = (e: FocusEvent) => {
    const { target: nextFocused, relatedTarget: prevFocused } = e;
    if (!isHTMLElement(nextFocused) || this.element === nextFocused) {
      return;
    }

    if (
      prevFocused === null ||
      (isHTMLElement(prevFocused) && !this.element.contains(prevFocused))
    ) {
      this._onFocusIn(prevFocused, nextFocused);
    }
  };

  private _onFocusOutBase = (e: FocusEvent) => {
    const { target: prevFocused, relatedTarget: nextFocused } = e;
    if (!isHTMLElement(prevFocused) || this.element === prevFocused) {
      return;
    }

    if (
      nextFocused === null ||
      (isHTMLElement(nextFocused) && !this.element.contains(nextFocused))
    ) {
      this._onFocusOut(prevFocused, nextFocused);
    }
  };
}
