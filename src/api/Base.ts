import { FOCUS_KIT_ATTR } from "../constants";
import { EntityId, EntityType } from "../types";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";

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
    this.element._focuskitEntity = entity;
  }
}