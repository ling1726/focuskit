import { FOCUS_KIT_ATTR } from "../constants";
import { EntityId, EntityType } from "../types";
import { isHTMLElement } from "./isHTMLElement";

export function getParentEntities(start: unknown, end?: unknown): { entity: EntityType, id: EntityId }[] {
  const entities: { entity: EntityType, id: EntityId }[] = [];
  if (!isHTMLElement(start) || !isHTMLElement(end)) {
    return entities;
  }

  let cur: HTMLElement | null = start.parentElement;
  while (cur && cur !== end) {
    if (cur._focuskitEntity) {
      entities.push({ entity: cur._focuskitEntity, id: cur.getAttribute(FOCUS_KIT_ATTR)! });
    }

    cur = cur.parentElement;
  }

  return entities;
}