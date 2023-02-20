import * as React from "react";
import { Trap } from "@focuskit/vanilla";

const defaultImperative = {
  enable: () => null,
  disable: () => null,
};

export function useTrap<TElement extends HTMLElement = HTMLElement>(
  id: string
) {
  const elementRef = React.useRef<TElement>();
  const imperativeRef = React.useRef<{
    enable: () => void;
    disable: () => void;
  }>(defaultImperative);

  React.useEffect(() => {
    if (elementRef.current) {
      const trap = new Trap(elementRef.current, { id });
      imperativeRef.current = {
        enable: () => {
          trap.active = true;
        },
        disable: () => trap.active = false
      }

      return () => {
        trap.dispose();
        imperativeRef.current = defaultImperative;
      }
    }
  }, [id]);

  return { elementRef, imperativeRef };
}
