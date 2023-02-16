import { FOCUSKIT_EVENT } from "../constants";
import { EntityId } from "../types";
import { isFocusKitEvent } from "../utils/isFocusKitEvent";

export class Disabled {
  element: HTMLElement;
  id: EntityId;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    const { id } = options;
    this.element = element;
    this.id = id;

    this.element.addEventListener(FOCUSKIT_EVENT, this._handleEvent, true);
  }

  dispose() {
    this.element.removeEventListener(FOCUSKIT_EVENT, this._handleEvent, true);
  }

  private _handleEvent = (e: Event) => {
    if (!isFocusKitEvent(e)) {
      throw Error(
        `focuskit received an event of type ${e.type}, this is a bug`
      );
    }

    e.preventDefault();
    console.log("cancelling event", e.detail);
  };
}
