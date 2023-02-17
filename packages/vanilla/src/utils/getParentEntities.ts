import { EntityId, EntityType } from "../types";
import { isHTMLElement } from "./isHTMLElement";

export function getParentEntities(
  start: unknown,
  end?: unknown
): { entity: EntityType; id: EntityId }[] {
  if (start === end) {
    return [];
  }

  const entities: { entity: EntityType; id: EntityId }[] = [];
  if (!isHTMLElement(start) || !isHTMLElement(end)) {
    return entities;
  }

  let cur: HTMLElement | null = start.parentElement;

  while (cur && cur !== end) {
    if (cur._focuskitFlags) {
      const { entity, id } = cur._focuskitFlags;
      entities.push({
        entity,
        id,
      });
    }

    cur = cur.parentElement;
  }

  return entities;
}
