import * as React from 'react';
import { TrapGroup } from '@focuskit/vanilla';

export function useTrapGroup(id: string) {
  const instance = React.useRef<TrapGroup>();

  return React.useCallback((element: HTMLElement | null) => {
    if (element) {
      instance.current = new TrapGroup(element, { id });
    } else {
      instance.current?.dispose();
    }
  }, []);
}