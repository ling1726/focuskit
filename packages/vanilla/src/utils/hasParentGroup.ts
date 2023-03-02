export const hasParentGroup = (element: HTMLElement) => {
  let currentElement = element.parentElement;
  while (currentElement) {
    if (
      currentElement._focuskitFlags &&
      currentElement._focuskitFlags.category === "group" &&
      !currentElement._focuskitFlags.active
    ) {
      return true;
    }

    currentElement = currentElement.parentElement;
  }

  return false;
};
