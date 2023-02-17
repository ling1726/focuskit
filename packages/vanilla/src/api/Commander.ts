import { FOCUSKIT_EVENT } from "../constants";
import { createPipe } from "../utils/createPipe";
import { BaseEvent, Pipe } from "../types";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";
import { isFocusKitEvent } from "../utils/isFocusKitEvent";
import { moveNext } from "../events/moveNext";
import { movePrev } from "../events/movePrev";
import { moveFirst } from "../events/moveFirst";
import { moveLast } from "../events/moveLast";
import { focusFirst } from "../events/focusFirst";
import { focusLast } from "../events/focusLast";
import { focusTarget } from "../events/focusTarget";
import { isHTMLElement } from "../utils/isHTMLElement";
import { updateTabIndex } from "../events/updateTabIndex";
import { recalcTabIndexes } from "../events/recalcTabIndexes";
import { assertHTMLElement } from "../utils/assertHTMLElement";

export class Commander {
  public element: HTMLElement;

  private _messagePipe: Pipe;
  private _elementWalker: HTMLElementWalker;
  constructor(element: HTMLElement) {
    this.element = element;
    this._elementWalker = new HTMLElementWalker(this.element);

    this._messagePipe = createPipe();
    this._messagePipe.use(moveNext);
    this._messagePipe.use(movePrev);
    this._messagePipe.use(moveFirst);
    this._messagePipe.use(moveLast);
    this._messagePipe.use(focusFirst);
    this._messagePipe.use(focusLast);
    this._messagePipe.use(focusTarget);
    this._messagePipe.use(updateTabIndex);
    this._messagePipe.use(recalcTabIndexes);

    if (this.element.hasAttribute('data-commander')) {
      return;
    }

    this.element.setAttribute("data-commander", "");
    this.element.addEventListener(FOCUSKIT_EVENT, this._handleEvent);
  }

  dispose() {
    this.element.removeAttribute("data-commander");
    this.element.removeEventListener(FOCUSKIT_EVENT, this._handleEvent);
  }

  private _handleEvent = (event: Event) => {
    if (event.defaultPrevented) {
      return;
    }

    assertHTMLElement(event.target);
    event.stopImmediatePropagation();
    event.preventDefault();

    if (!isFocusKitEvent(event)) {
      throw Error(
        `focuskit received an event of type ${event.type}, this is a bug`
      );
    }

    this._elementWalker.root = event.target;
    const activeElement = isHTMLElement(document.activeElement)
      ? document.activeElement
      : null;

    const eventsToHandle: BaseEvent[] = Array.isArray(event.detail)
      ? event.detail
      : [event.detail];

    for (const eventToHandle of eventsToHandle) {
      console.log("handling event", eventToHandle);
      this._messagePipe.handleEvent(eventToHandle, {
        elementWalker: this._elementWalker,
        activeElement,
        target: event.target,
      });
    }
  };
}
