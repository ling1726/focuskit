import { getParentEntities } from "./getParentEntities";

export function hasParentEntities(start: unknown, end?: unknown): boolean {
  return !!getParentEntities(start, end).length;
}
