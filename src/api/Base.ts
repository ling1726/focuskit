import { FOCUS_KIT_ATTR } from "../constants";
import { EntityId, EntityType, FocusKitFlags } from "../types";

export class Base {
  element: HTMLElement;
  id: EntityId;
  entity: EntityType;

  constructor(element: HTMLElement, options: { id: EntityId, entity: EntityType, flags: FocusKitFlags }) {
    const { id, entity, flags } = options;

    this.element = element;
    this.element._focuskitFlags = flags;
    this.id = id;
    this.entity = entity;
    this.element.setAttribute(FOCUS_KIT_ATTR, this.id.toString());
    this.element._focuskitEntity = entity;
  }
}