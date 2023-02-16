import { FocusKitEventHandler, RecalcTabIndexesEvent } from "../types";
import { HTMLElementWalker } from "../utils/HTMLElementWalker";
import { isFocusable } from "../utils/isFocusable";
import { isTabbable } from "../utils/isTabbable";
import { makeFocusable } from "../utils/makeFocusable";
import { makeTabbable } from "../utils/makeTabbable";
import { allFocusable } from "../utils/nodeFilters";
import { isRecalcTabIndexesEvent } from "./assertions/isRecalcTabIndexesEvent";

interface RecalcQueueItem extends RecalcTabIndexesEvent {
  target: HTMLElement;
}

export const recalcTabIndexes: FocusKitEventHandler = (e, state, _next) => {
  if (!isRecalcTabIndexesEvent(e)) {
    return;
  }

  let queuedRecalcs: RecalcQueueItem[] = [];
  queuedRecalcs.push({
    ...e,
    target: state.target,
  });

  while (queuedRecalcs.length) {
    const { target } = queuedRecalcs.shift()!;
    const { active, tabbable } = target._focuskitFlags!;

    let children: RecalcQueueItem[] = [];
    if (tabbable) {
      console.log("started recalc", target);
      if (active) {
        children = recalcActiveTabbable(target, undefined, state.elementWalker);
      } else {
        children = recalcInActiveTabbable(
          target,
          undefined,
          state.elementWalker
        );
      }
      console.log("finished recalc", target);
    } else {
      console.log("started recalc", target);
      if (active) {
        children = recalcActiveCollection(
          target,
          undefined,
          state.elementWalker
        );
      } else {
        children = recalcInActiveCollection(
          target,
          undefined,
          state.elementWalker
        );
      }
      console.log("finished recalc", target);
    }

    queuedRecalcs = queuedRecalcs.concat(children);
  }
};

function recalcActiveTabbable(
  target: HTMLElement,
  originalTarget: HTMLElement | undefined,
  elementWalker: HTMLElementWalker
): RecalcQueueItem[] {
  makeTabbable(target);
  elementWalker.root = target;
  const res: RecalcQueueItem[] = [];
  elementWalker.filter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      const { entity, id } = element._focuskitFlags;
      res.push({
        entity,
        id,
        type: "recalctabindexes",
        originalTarget: originalTarget ?? target,
        target: element,
      });

      if (!element._focuskitFlags.tabbable) {
        return NodeFilter.FILTER_REJECT;
      }
    }

    makeTabbable(element);
    return NodeFilter.FILTER_REJECT;
  };

  while (elementWalker.nextElement()) {}
  return res;
}

function recalcInActiveTabbable(
  target: HTMLElement,
  originalTarget: HTMLElement | undefined,
  elementWalker: HTMLElementWalker
): RecalcQueueItem[] {
  const res: RecalcQueueItem[] = [];
  elementWalker.root = target;
  elementWalker.filter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      const { entity, id } = element._focuskitFlags;
      res.push({
        entity,
        id,
        type: "recalctabindexes",
        originalTarget: originalTarget ?? target,
        target: element,
      });

      if (!element._focuskitFlags.tabbable) {
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
  originalTarget: HTMLElement | undefined,
  elementWalker: HTMLElementWalker
): RecalcQueueItem[] {
  const res: RecalcQueueItem[] = [];
  const hasParentTabbable = () => {
    let cur = target.parentElement;
    while (cur) {
      if (
        cur._focuskitFlags &&
        cur._focuskitFlags.tabbable &&
        !cur._focuskitFlags.active
      ) {
        return true;
      }

      cur = cur.parentElement;
    }

    return false;
  };

  elementWalker.root = target;
  elementWalker.filter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      const { entity, id } = element._focuskitFlags;
      res.push({
        entity,
        id,
        type: "recalctabindexes",
        originalTarget: originalTarget ?? target,
        target: element,
      });
    }

    makeFocusable(element);
    return NodeFilter.FILTER_REJECT;
  };

  while (elementWalker.nextElement()) {}

  if (!hasParentTabbable()) {
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
  originalTarget: HTMLElement | undefined,
  elementWalker: HTMLElementWalker
): RecalcQueueItem[] {
  const res: RecalcQueueItem[] = [];
  elementWalker.root = target;
  let foundTabbable = false;
  elementWalker.filter = (element) => {
    if (!isFocusable(element)) {
      return NodeFilter.FILTER_SKIP;
    }

    if (element._focuskitFlags) {
      const { entity, id } = element._focuskitFlags;
      res.push({
        entity,
        id,
        type: "recalctabindexes",
        originalTarget: originalTarget ?? target,
        target: element,
      });
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
