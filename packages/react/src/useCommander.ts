import * as React from 'react';
import { Commander } from '@focuskit/vanilla';

export function useCommander() {
  const instance = React.useRef<Commander>();

  return React.useCallback((element: HTMLElement | null) => {
    if (element) {
        if (!element.hasAttribute("data-commander")) {
            instance.current = new Commander(element);
        }
    } else {
      instance.current?.dispose();
    }
  }, []);
}