import { FocusKitEventHandler } from "../types";
import { hasParentGroup } from "../utils/hasParentGroup";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";
import { isFocusable } from "../utils/isFocusable";
import { isTabbable } from "../utils/isTabbable";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { allFocusable } from "../utils/nodeFilters";
import { isRecalcTabIndexesEvent } from "./assertions/isRecalcTabIndexesEvent";

export const recalcTabIndexes: FocusKitEventHandler = (e, state, next) => {
  if (!isRecalcTabIndexesEvent(e)) {
    next();
    return;
  }

  let queuedRecalcs: HTMLElement[] = [];
  queuedRecalcs.push(state.target);

  while (queuedRecalcs.length) {
    const target = queuedRecalcs.shift()!;
    const { active, category } = target._focuskitFlags!;

    let children: HTMLElement[] = [];
    if (category === "group") {
      console.log("started recalc", target);

      children = active
        ? recalcActiveGroup(target, state.elementWalker)
        : recalcInActiveGroup(target, state.elementWalker);

      console.log("finished recalc", target);
    } else {
      console.log("started recalc", target);

      children = active
        ? recalcActiveCollection(target, state.elementWalker)
        : recalcInActiveCollection(target, state.elementWalker);

      console.log("finished recalc", target);
    }

    queuedRecalcs = queuedRecalcs.concat(children);
  }
};

function recalcActiveGroup(
  target: HTMLElement,
  elementWalker: HTMLElementWalker
): HTMLElement[] {
  makeTabbable(target);
  elementWalker.root = target;
  const res: HTMLElement[] = [];
  elementWalker.filter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      res.push(element);

      if (element._focuskitFlags.category !== "group") {
        return NodeFilter.FILTER_REJECT;
      }
    }

    makeTabbable(element);
    return NodeFilter.FILTER_REJECT;
  };

  while (elementWalker.nextElement()) {}
  return res;
}

function recalcInActiveGroup(
  target: HTMLElement,
  elementWalker: HTMLElementWalker
): HTMLElement[] {
  const res: HTMLElement[] = [];
  elementWalker.root = target;
  elementWalker.filter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      res.push(element);

      if (element._focuskitFlags.category !== "group") {
        return NodeFilter.FILTER_REJECT;
      }
    }

    makeFocusable(element);
    return NodeFilter.FILTER_REJECT;
  };

  while (elementWalker.nextElement()) {}
  return res;
}

function recalcInActiveCollection(
  target: HTMLElement,
  elementWalker: HTMLElementWalker
): HTMLElement[] {
  const res: HTMLElement[] = [];
  elementWalker.root = target;
  elementWalker.filter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      res.push(element);
    }

    makeFocusable(element);
    return NodeFilter.FILTER_REJECT;
  };

  while (elementWalker.nextElement()) {}

  if (!hasParentGroup(target)) {
    elementWalker.filter = allFocusable;
    const firstChild = elementWalker.firstChild();
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
  elementWalker.filter = (element) => {
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

  while (elementWalker.nextElement()) {}

  if (!foundTabbable) {
    elementWalker.filter = allFocusable;
    const firstChild = elementWalker.firstChild();
    if (firstChild) {
      makeTabbable(firstChild);
    }
  }

  return res;
}
