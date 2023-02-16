import {
  DIRECTION_FIRST,
  DIRECTION_LAST,
  DIRECTION_NEXT,
  DIRECTION_PREV,
  LIST,
} from "../constants";
import {
  List as IList,
  ListOptions,
  MoveEvent,
  RecalcTabIndexesEvent,
} from "../types";
import { createFocusKitEvent } from "../utils/createFocusKitEvent";
import { hasParentEntities } from "../utils/hasParentEntities";
import { Base } from "./Base";

export class List extends Base implements IList {
  private _axis: "horizontal" | "vertical" | "both";
  protected _keyHandlers: Record<string, (e: KeyboardEvent) => void> = {};

  constructor(element: HTMLElement, options: ListOptions) {
    const { id, axis = "both" } = options;
    super(element, {
      id,
      entity: LIST,
    });

    this.element = element;
    this._axis = axis;
    this.id = id;
    this.element.addEventListener("keydown", this._onKeyDown);
    this._registerKeys();
    this._recalcTabIndexes();
  }

  protected _onFocusIn(): void {
    this.active = true;
  }

  protected _onFocusOut(): void {
    this.active = false;
  }

  protected onActiveChange(): void {}

  private _registerKeys() {
    this._keyHandlers["ArrowUp"] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers["ArrowDown"] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers["ArrowLeft"] = () => this._focus(DIRECTION_PREV);
    this._keyHandlers["ArrowRight"] = () => this._focus(DIRECTION_NEXT);
    this._keyHandlers["Home"] = () => this._focus(DIRECTION_FIRST);
    this._keyHandlers["End"] = () => this._focus(DIRECTION_LAST);

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

  private _focus(direction: MoveEvent["direction"]) {
    const detail: MoveEvent = {
      entity: LIST,
      id: this.id,
      type: "move",
      direction,
    };

    const event = createFocusKitEvent(detail);

    this.element.dispatchEvent(event);
  }

  protected _onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (hasParentEntities(e.target, this.element)) {
      return;
    }

    if (e.key in this._keyHandlers) {
      this._keyHandlers[e.key](e);
      e.preventDefault();
    }
  };
}
