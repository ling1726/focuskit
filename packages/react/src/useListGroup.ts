import * as React from 'react';
import { ListGroup } from '@focuskit/vanilla';

export function useListGroup<TElement extends HTMLElement = HTMLElement>(id: string) {
  const elementRef = React.useRef<TElement>();

  React.useEffect(() => {
    if (elementRef.current) {
      const list = new ListGroup(elementRef.current, { id });
      return () => list.dispose();
    }
  }, [id]);

  return elementRef;
}