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

  private _handleEvent = (event: Event) => {
    if (!isFocusKitEvent(event)) {
      throw Error(
        `focuskit received an event of type ${event.type}, this is a bug`
      );
    }

    event.preventDefault();
  };
}
