import { FocusKitEventHandler, HTMLElementFilter } from "../types";
import { hasParentGroup } from "../utils/hasParentGroup";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";
import { isFocusable } from "../utils/isFocusable";
import { isTabbable } from "../utils/isTabbable";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { allFocusable } from "../utils/nodeFilters";
import { isRecalcTabIndexesEvent } from "./assertions/isRecalcTabIndexesEvent";

export const recalcTabIndexes: FocusKitEventHandler = (event, state, next) => {
  if (!isRecalcTabIndexesEvent(event)) {
    next();
    return;
  }

  let queuedRecalcs: HTMLElement[] = [];
  queuedRecalcs.push(state.target);

  while (queuedRecalcs.length) {
    const target = queuedRecalcs.shift();
    if (!target || !target._focuskitFlags) {
      continue;
    }
    const { active, category } = target._focuskitFlags;

    let childEntities: HTMLElement[] = [];

    if (category === "group") {
      childEntities = active
        ? recalcActiveGroup(target, state.elementWalker)
        : recalcInActiveGroup(target, state.elementWalker);
    }

    if (category === "collection") {
      childEntities = active
        ? recalcActiveCollection(target, state.elementWalker)
        : recalcInActiveCollection(target, state.elementWalker);
    }

    queuedRecalcs = queuedRecalcs.concat(childEntities);
  }
};

function recalcActiveGroup(
  target: HTMLElement,
  elementWalker: HTMLElementWalker
): HTMLElement[] {
  makeTabbable(target);
  elementWalker.root = target;
  const res: HTMLElement[] = [];

  const filter: HTMLElementFilter = (element) => {
    if (element._focuskitFlags) {
      res.push(element);

      if (element._focuskitFlags.category !== "group") {
        return NodeFilter.FILTER_REJECT;
      }
    }

    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    makeTabbable(element);
    return NodeFilter.FILTER_REJECT;
  };

  while (elementWalker.nextElement(filter)) {
    /* noop */
  }
  return res;
}

function recalcInActiveGroup(
  target: HTMLElement,
  elementWalker: HTMLElementWalker
): HTMLElement[] {
  const res: HTMLElement[] = [];
  elementWalker.root = target;

  const filter: HTMLElementFilter = (element) => {
    if (element._focuskitFlags) {
      res.push(element);

      if (element._focuskitFlags.category !== "group") {
        return NodeFilter.FILTER_REJECT;
      }
    }

    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    makeFocusable(element);
    return NodeFilter.FILTER_REJECT;
  };
  while (elementWalker.nextElement(filter)) {
    /* noop */
  }
  return res;
}

function recalcInActiveCollection(
  target: HTMLElement,
  elementWalker: HTMLElementWalker
): HTMLElement[] {
  const res: HTMLElement[] = [];
  elementWalker.root = target;

  const filter: HTMLElementFilter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      res.push(element);
    }

    makeFocusable(element);
    return NodeFilter.FILTER_REJECT;
  };
  while (elementWalker.nextElement(filter)) {
    /* noop */
  }

  if (!hasParentGroup(target)) {
    const firstChild = elementWalker.firstChild(allFocusable);
    if (firstChild) {
      makeTabbable(firstChild);
    }
  }

  return res;
}

function recalcActiveCollection(
  target: HTMLElement,
  elementWalker: HTMLElementWalker
): HTMLElement[] {
  const res: HTMLElement[] = [];
  elementWalker.root = target;
  let foundTabbable = false;

  const filter: HTMLElementFilter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      res.push(element);
    }

    if (isTabbable(element)) {
      foundTabbable = true;
    } else {
      makeFocusable(element);
    }

    return NodeFilter.FILTER_REJECT;
  };
  while (elementWalker.nextElement(filter)) {
    /* noop */
  }

  if (!foundTabbable) {
    const firstChild = elementWalker.firstChild(allFocusable);
    if (firstChild) {
      makeTabbable(firstChild);
    }
  }

  return res;
}
