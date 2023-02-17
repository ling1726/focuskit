export const hasParentGroup = (element: HTMLElement) => {
  let cur = element.parentElement;
  while (cur) {
    if (
      cur._focuskitFlags &&
      cur._focuskitFlags.category === "group" &&
      !cur._focuskitFlags.active
    ) {
      return true;
    }

    cur = cur.parentElement;
  }

  return false;
};
