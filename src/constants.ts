export const FOCUSKIT_EVENT = "focuskit";
export const FOCUS_KIT_ATTR = "data-focuskit";

export const entities = {
  LIST: "List",
  TRAPGROUP: "TrapGroup",
  TRAP: "Trap",
  LISTGROUP: "ListGroup",
} as const;

export const events = {
  MOVE_EVENT: "move",
  RECALC_TABINDEXES: "recalctabindexes",
  UPDATE_TABINDEX_EVENT: "updatetabindex",
  FOCUS_ELEMENT: "focuselement",
} as const;

export const directions = {
  FIRST: "first",
  LAST: "last",
  NEXT: "next",
  PREV: "prev",
} as const;
