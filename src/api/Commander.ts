import { FOCUSKIT_EVENT } from "../constants";
import { createPipe } from "../utils/createPipe";
import { Pipe } from "../types";
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

export class Commander {
  public element: HTMLElement;

  private _messagePipe: Pipe;
  private _elementWalker: HTMLElementWalker;
  constructor(element: HTMLElement) {
    this.element = element;
    this._elementWalker = new HTMLElementWalker(this.element);
    this.element.setAttribute("data-commander", "");
    this.element.addEventListener(FOCUSKIT_EVENT, this._handleEvent);

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
  }

  private _handleEvent = (event: Event) => {
    if (!isFocusKitEvent(event)) {
      throw Error(
        `focuskit received an event of type ${event.type}, this is a bug`
      );
    }

    if (event.defaultPrevented) {
      return;
    }

    if (!isHTMLElement(event.target)) {
      return;
    }

    console.log("handling event", event.detail);

    this._elementWalker.root = event.target;
    const activeElement = isHTMLElement(document.activeElement)
      ? document.activeElement
      : null;

    this._messagePipe.handleEvent(event.detail, {
      elementWalker: this._elementWalker,
      activeElement,
      target: event.target,
    });
  };
}
