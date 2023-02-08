export interface FocusableWalker {
  setCurrent: (element: HTMLElement) => void;
  next: () => HTMLElement | null;
  prev: () => HTMLElement | null;
  first: () => HTMLElement | null;
  last: () => HTMLElement | null;
}

export type ZoneId = number | string;

export interface ZoneOptions {
  id?: ZoneId;
}

export interface Zone {
  element: HTMLElement;
  id: ZoneId;
  nextZone: Zone | undefined;
  prevZone: Zone | undefined;
}

export interface ZoneCreateEvent {
  zone: Zone;
}

export interface ZoneDisposeEvent {
  id: ZoneId;
}