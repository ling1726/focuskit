import { FOCUS_KIT_ATTR } from "../constants";
import { EntityId, EntityType } from "../types";
import { isHTMLElement } from "../utils/isHTMLElement";

export abstract class Base {
  element: HTMLElement;
  id: EntityId;
  entity: EntityType;

  protected _active: boolean = false;

  constructor(
    element: HTMLElement,
    options: { id: EntityId; entity: EntityType }
  ) {
    const { id, entity } = options;

    let tabbable = true;
    switch (entity) {
      case "List":
        tabbable = false;
    }

    this.element = element;

    this.element._focuskitFlags = {
      active: false,
      entity,
      id,
      tabbable,
    };

    this.id = id;
    this.entity = entity;
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
    this.element._focuskitEntity = entity;
    this.element.addEventListener("focusin", this._onFocusInBase);
    this.element.addEventListener("focusout", this._onFocusOutBase);
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
}
