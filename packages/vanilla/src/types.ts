import { HTMLElementWalker } from "./utils/HTMLElementWalker";

export interface FocusableWalker {
  setCurrent: (element: HTMLElement) => void;
  next: () => HTMLElement | null;
  prev: () => HTMLElement | null;
  first: () => HTMLElement | null;
  last: () => HTMLElement | null;
}

export type HTMLElementFilter = (element: HTMLElement) => number;

export type DefaultTabbable = "first" | HTMLElement | null;

export type TabAreaId = number | string;
export type EntityId = number | string;
export type EntityType = "List" | "Trap" | "TrapGroup" | "ListGroup";
export type EntityCategory = "group" | "collection";

export interface FocusKitFlags {
  active: boolean;
  id: EntityId;
  entity: EntityType;
  category: EntityCategory;
}

export interface ListOptions {
  id: EntityId;
  resetOnBlur?: boolean;
  axis?: "horizontal" | "vertical" | "both";
  defaultTabbable?: DefaultTabbable;
}

export type FocusKitEventHandler = (
  event: BaseEvent,
  state: FocusKitEventHandlerState,
  next: () => void
) => void;
export type Next = () => void;

export type Pipe = {
  use: (...middlewares: FocusKitEventHandler[]) => void;
  handleEvent: (event: BaseEvent, state: FocusKitEventHandlerState) => void;
};

export interface FocusKitEventHandlerState {
  elementWalker: HTMLElementWalker;
  activeElement: HTMLElement | null;
  target: HTMLElement;
}

type EventType =
  | "move"
  | "focuselement"
  | "updatetabindex"
  | "recalctabindexes";

export interface BaseEvent<Type extends EventType = EventType> {
  id: EntityId;
  entity: EntityType;
  type: Type;
}

export interface MoveEvent extends BaseEvent<"move"> {
  direction: "next" | "prev" | "first" | "last";
}

export interface UpdateTabIndexEvent extends BaseEvent<"updatetabindex"> {
  tabindex: "focusable" | "tabbable";
  element: HTMLElement;
}

export interface FocusElementEvent extends BaseEvent<"focuselement"> {
  element?: HTMLElement;
  strategy?: "first" | "last";
}

export interface RecalcTabIndexesEvent extends BaseEvent<"recalctabindexes"> {
  originalTarget: HTMLElement | undefined;
}
