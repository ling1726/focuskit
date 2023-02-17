import * as React from 'react';
import { ListGroup } from '@focuskit/vanilla';

export function useListGroup(id: string) {
  const instance = React.useRef<ListGroup>();

  return React.useCallback((element: HTMLElement | null) => {
    if (element) {
      instance.current = new ListGroup(element, { id });
    } else {
      instance.current?.dispose();
    }
  }, []);
}