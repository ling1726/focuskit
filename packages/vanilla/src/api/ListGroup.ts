import { entities, directions, events } from "../constants";
import {
  EntityCategory,
  FocusElementEvent,
  ListOptions,
  MoveEvent,
  UpdateTabIndexEvent,
} from "../types";
import { hasParentEntities } from "../utils/hasParentEntities";
import { Entity } from "./Entity";

export class ListGroup extends Entity {
  private _axis: "horizontal" | "vertical" | "both";
  private _keyHandlers: Record<string, (e: KeyboardEvent) => void> = {};

  constructor(element: HTMLElement, options: ListOptions) {
    const { axis = "both" } = options;
    super(element, {
      ...options,
      entity: entities.LISTGROUP,
    });

    this._axis = axis;

    this.element.addEventListener("keydown", this._onKeyDown);

    this._registerKeys();
    this.recalcTabIndexes();
  }

  dispose() {
    super.dispose();
    this.element.removeEventListener("keydown", this._onKeyDown);
  }

  protected onActiveChange(): void {
    this.recalcTabIndexes();
    this._registerKeys();
    if (this._active) {
      this._setTabindex("focusable");
      this._focusFirst();
    } else {
      this._setTabindex("tabbable");
      if (document.activeElement !== document.body) {
        this._focusElement();
      }
    }
  }

  protected onFocusIn(): void {
    this.category = "collection";
    this.active = true;
  }

  protected onFocusOut() {
    this.category = "group";
    this.active = false;
  }

  private _setTabindex(tabindex: UpdateTabIndexEvent["tabindex"]) {
    this.dispatchFocusKitEvent<UpdateTabIndexEvent>({
      type: events.UPDATE_TABINDEX_EVENT,
      element: this.element,
      tabindex,
    });
  }

  private _focusFirst() {
    this.dispatchFocusKitEvent<FocusElementEvent>({
      type: events.FOCUS_ELEMENT,
      strategy: "first",
    });
  }

  private _focusElement() {
    this.dispatchFocusKitEvent<FocusElementEvent>({
      type: events.FOCUS_ELEMENT,
      element: this.element,
    });
  }

  private _focus(direction: MoveEvent["direction"]) {
    if (!this.active) {
      return;
    }

    const detail: MoveEvent = {
      entity: this.entity,
      id: this.id,
      type: events.MOVE_EVENT,
      direction,
    };

    this.dispatchFocusKitEvent(detail);
  }

  private set category(val: EntityCategory) {
    if (this.element._focuskitFlags) {
      this.element._focuskitFlags.category = val;
    }
  }

  private _registerKeys() {
    this._keyHandlers["ArrowUp"] = () => this._focus(directions.PREV);
    this._keyHandlers["ArrowDown"] = () => this._focus(directions.NEXT);
    this._keyHandlers["ArrowLeft"] = () => this._focus(directions.PREV);
    this._keyHandlers["ArrowRight"] = () => this._focus(directions.NEXT);
    this._keyHandlers["Home"] = () => this._focus(directions.FIRST);
    this._keyHandlers["End"] = () => this._focus(directions.LAST);
    this._keyHandlers["Enter"] = () => {
      this.category = "collection";
      this.active = true;
    };
    this._keyHandlers["Escape"] = () => {
      this.category = "group";
      this.active = false;
    };

    if (!this.active) {
      delete this._keyHandlers["ArrowUp"];
      delete this._keyHandlers["ArrowDown"];
      delete this._keyHandlers["ArrowLeft"];
      delete this._keyHandlers["ArrowRight"];
    }

    switch (this._axis) {
      case "horizontal":
        delete this._keyHandlers["ArrowUp"];
        delete this._keyHandlers["ArrowDown"];
        break;
      case "vertical":
        delete this._keyHandlers["ArrowLeft"];
        delete this._keyHandlers["ArrowRight"];
        break;
      default:
    }
  }

  private _onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (hasParentEntities(event.target, this.element)) {
      return;
    }

    if (event.key in this._keyHandlers) {
      this._keyHandlers[event.key](event);
      if (event.key !== "Enter" && event.key !== "Escape") {
        event.preventDefault();
      }
    }
  };
}
