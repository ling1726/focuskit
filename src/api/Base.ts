import { FOCUS_KIT_ATTR } from "../constants";
import { EntityId } from "../types";

export class Base {
  element: HTMLElement;
  id: EntityId;

  constructor(element: HTMLElement, options: { id: EntityId }) {
    const { id } = options;

    this.element = element;
    this.id = id;
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
  }
}