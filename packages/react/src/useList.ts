import * as React from 'react';
import { List } from '@focuskit/vanilla';

export function useList<TElement extends HTMLElement = HTMLElement>(id: string) {
  const elementRef = React.useRef<TElement>();

  React.useEffect(() => {
    if (elementRef.current) {
      const list = new List(elementRef.current, { id });
      return () => list.dispose();
    }
  }, [id]);

  return elementRef;
}