import { HTMLElementWalker } from "./utils/HTMLElementWalker";

export interface FocusableWalker {
  setCurrent: (element: HTMLElement) => void;
  next: () => HTMLElement | null;
  prev: () => HTMLElement | null;
  first: () => HTMLElement | null;
  last: () => HTMLElement | null;
}

export interface IHTMLElementWalker {
  firstChild(): HTMLElement | null;
  lastChild(): HTMLElement | null;
  nextElement(): HTMLElement | null;
  nextSibling(): HTMLElement | null;
  parentElement(): HTMLElement | null;
  previousElement(): HTMLElement | null;
  previousSibling(): HTMLElement | null;
  currentElement: HTMLElement;
  readonly root: HTMLElement;
  readonly filter: HTMLElementFilter;
};

export type HTMLElementFilter = (element: HTMLElement) => number;

export type TabAreaId = number | string;
export type EntityId = number | string;
export type EntityType = 'arrowzone' | 'trap';

export interface ArrowZoneOptions {
  id: EntityId;
  resetOnBlur?: boolean;
}

export interface ArrowZone {
  element: HTMLElement;
  id: EntityId;
}

export type FocusKitEventHandler = (e: CustomEvent<BaseEvent>, state: FocusKitEventHandlerState, next: () => void) => void;
export type Next = () => void;

export type Pipe = {
  use: (...middlewares: FocusKitEventHandler[]) => void;
  handleEvent: (event: CustomEvent<BaseEvent>, state: FocusKitEventHandlerState) => void;
};

export interface FocusKitEventHandlerState {
  elementWalker: HTMLElementWalker;
}

export interface BaseEvent<TEventType = 'move' | 'init' | 'focuselement'> {
  id: EntityId;
  entity: EntityType
  type: TEventType
}

export interface MoveEvent extends BaseEvent<'move'> {
  direction: 'next' | 'prev' | 'first' | 'last';
}

export interface InitEvent extends BaseEvent<'init'> { }

export interface FocusElementEvent extends BaseEvent<'focuselement'> {
  target?: HTMLElement;
  strategy?: 'first' | 'last';
}