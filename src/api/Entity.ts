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

  protected dispose() {
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

    console.log(this.entity, this.id, "active:", val);
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

  protected createFocusKitEvent<T extends BaseEvent>(
    details: Omit<T, "id" | "entity">
  ): CustomEvent<T> {
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

    return event;
  }

  recalcTabIndexes() {
    const event = this.createFocusKitEvent<RecalcTabIndexesEvent>({
      originalTarget: this.element,
      type: "recalctabindexes",
    });

    this.element.dispatchEvent(event);
  }

  private _onFocusInBase = (e: FocusEvent) => {
    const { target: nextFocused, relatedTarget: prevFocused } = e;
    if (!isHTMLElement(nextFocused)) {
      return;
    }

    if (prevFocused === null) {
      if (this.element.contains(nextFocused) && this.element !== nextFocused) {
        this._onFocusIn(prevFocused, nextFocused);
      }

      return;
    }

    if (!isHTMLElement(prevFocused)) {
      return;
    }

    if (!this.element.contains(prevFocused) && this.element !== nextFocused) {
      this._onFocusIn(prevFocused, nextFocused);
    }
  };

  private _onFocusOutBase = (e: FocusEvent) => {
    const { target: prevFocused, relatedTarget: nextFocused } = e;
    if (!isHTMLElement(prevFocused)) {
      return;
    }

    if (nextFocused === null) {
      if (this.element.contains(prevFocused) && this.element !== prevFocused) {
        this._onFocusOut(prevFocused, nextFocused);
      }

      return;
    }

    if (!isHTMLElement(nextFocused)) {
      return;
    }

    if (!this.element.contains(nextFocused) && this.element !== prevFocused) {
      this._onFocusOut(prevFocused, nextFocused);
    }
  };
}
