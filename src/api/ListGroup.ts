import {
  DIRECTION_FIRST,
  DIRECTION_LAST,
  DIRECTION_NEXT,
  DIRECTION_PREV,
  LIST,
  LISTGROUP,
} from "../constants";
import {
  FocusElementEvent,
  ListOptions,
  MoveEvent,
  RecalcTabIndexesEvent,
  UpdateTabIndexEvent,
} from "../types";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { hasParentEntities } from "../utils/hasParentEntities";
import { Base } from "./Base";

export class ListGroup extends Base {
  private _axis: "horizontal" | "vertical" | "both";
  private _keyHandlers: Record<string, (e: KeyboardEvent) => void> = {};

  constructor(element: HTMLElement, options: ListOptions) {
    const { axis = "both" } = options;
    super(element, {
      ...options,
      entity: LISTGROUP,
    });

    this._axis = axis;

    this.element.addEventListener("keydown", this._onKeyDown);

    this._registerKeys();
    this._recalcTabIndexes();
  }

  enable() {
    this.makeElementUntabbable();
    this.focusFirst();
  }

  disable() {
    this.makeTabbable();
    if (document.activeElement !== document.body) {
      this.focusElement();
    }
  }

  makeElementUntabbable() {
    const details: UpdateTabIndexEvent = {
      entity: this.entity,
      id: this.id,
      type: "updatetabindex",
      element: this.element,
      tabindex: "focusable",
    };

    this.element.dispatchEvent(createFocusKitEvent(details));
  }

  makeTabbable() {
    const details: UpdateTabIndexEvent = {
      entity: this.entity,
      id: this.id,
      type: "updatetabindex",
      element: this.element,
      tabindex: "tabbable",
    };

    this.element.dispatchEvent(createFocusKitEvent(details));
  }

  focusFirst() {
    const details: FocusElementEvent = {
      entity: this.entity,
      id: this.id,
      type: "focuselement",
      strategy: "first",
    };

    this.element.dispatchEvent(createFocusKitEvent(details));
  }

  focusElement() {
    const details: FocusElementEvent = {
      entity: LISTGROUP,
      id: this.id,
      type: "focuselement",
      element: this.element,
    };

    this.element.dispatchEvent(createFocusKitEvent(details));
  }

  protected onActiveChange(): void {
    this._recalcTabIndexes();
    this._registerKeys();
    this.active ? this.enable() : this.disable();
  }

  protected _onFocusIn(): void {
    this.tabbable = false;
    this.active = true;
  }

  protected _onFocusOut() {
    this.tabbable = true;
    this.active = false;
  }

  private _focus(direction: MoveEvent["direction"]) {
    if (!this.active) {
      return;
    }

    const detail: MoveEvent = {
      entity: LISTGROUP,
      id: this.id,
      type: "move",
      direction,
    };

    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  private set tabbable(val: boolean) {
    this.element._focuskitFlags!.tabbable = val;
  }

  private _recalcTabIndexes() {
    const detail: RecalcTabIndexesEvent = {
      entity: LIST,
      id: this.id,
      type: "recalctabindexes",
      originalTarget: this.element,
    };

    const event = createFocusKitEvent(detail);
    this.element.dispatchEvent(event);
  }

  private _registerKeys() {
    this._keyHandlers["ArrowUp"] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers["ArrowDown"] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers["ArrowLeft"] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers["ArrowRight"] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers["Home"] = () => this._focus(DIRECTION_FIRST);
    this._keyHandlers["End"] = () => this._focus(DIRECTION_LAST);
    this._keyHandlers["Enter"] = () => {
      this.tabbable = false;
      this.active = true;
    };
    this._keyHandlers["Escape"] = () => {
      this.tabbable = true;
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

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (hasParentEntities(e.target, this.element)) {
      return;
    }

    if (e.key in this._keyHandlers) {
      this._keyHandlers[e.key](e);
      if (e.key !== "Enter" && e.key !== "Escape") {
        e.preventDefault();
      }
    }
  };
}
