import * as React from 'react';
import { Trap } from '@focuskit/vanilla';

export function useTrap(id: string) {
  const instance = React.useRef<Trap>();

  return React.useCallback((element: HTMLElement | null) => {
    if (element) {
      instance.current = new Trap(element, { id });
    } else {
      instance.current?.dispose();
    }
  }, []);
}