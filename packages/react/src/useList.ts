import * as React from 'react';
import { List } from '@focuskit/vanilla';

export function useList(id: string) {
  const instance = React.useRef<List>();

  return React.useCallback((element: HTMLElement | null) => {
    if (element) {
      instance.current = new List(element, { id });
    } else {
      instance.current?.dispose();
    }
  }, []);
}