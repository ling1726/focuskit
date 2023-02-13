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

export type DefaultTabbable = 'first' | HTMLElement | null;

export type TabAreaId = number | string;
export type EntityId = number | string;
export type EntityType = 'List' | 'Trap' | 'TrapGroup' | 'ListGroup';

export interface ListOptions {
  id: EntityId;
  resetOnBlur?: boolean;
  axis?: 'horizontal' | 'vertical' | 'both';
  defaultTabbable?: DefaultTabbable
}

export interface List {
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
  activeElement: HTMLElement | null;
}

type EventTypes = 'move' | 'resettabindexes' | 'focuselement' | 'enabletrapgroup' | 'disabletrapgroup' | 'updatetabindex' | 'disablelistgroup' | 'enablelistgroup';

export interface BaseEvent<TEventType extends EventTypes = EventTypes> {
  id: EntityId;
  entity: EntityType
  type: TEventType
}

export interface MoveEvent extends BaseEvent<'move'> {
  direction: 'next' | 'prev' | 'first' | 'last';
}

export interface UpdateTabIndexEvent extends BaseEvent<'updatetabindex'> {
  prev: HTMLElement;
}

export interface EnableListGroupEvent extends BaseEvent<'enablelistgroup'> { }
export interface DisableListGroupEvent extends BaseEvent<'disablelistgroup'> { }

export interface ResetTabIndexesEvent extends BaseEvent<'resettabindexes'> {
  defaultTabbable: DefaultTabbable,
}

export interface EnableTrapGroupEvent extends BaseEvent<'enabletrapgroup'> { }

export interface DisableTrapGroupEvent extends BaseEvent<'disabletrapgroup'> { }

export interface FocusElementEvent extends BaseEvent<'focuselement'> {
  target?: HTMLElement;
  strategy?: 'first' | 'last';
}
