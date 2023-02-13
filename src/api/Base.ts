import { FOCUS_KIT_ATTR } from "../constants";
import { EntityId, EntityType } from "../types";

export class Base {
  element: HTMLElement;
  id: EntityId;
  entity: EntityType;

  constructor(element: HTMLElement, options: { id: EntityId, entity: EntityType }) {
    const { id, entity } = options;

    this.element = element;
    this.id = id;
    this.entity = entity;
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
  }
}