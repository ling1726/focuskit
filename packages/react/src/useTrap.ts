import * as React from 'react';
import { Trap } from '@focuskit/vanilla';

export function useTrap<TElement extends HTMLElement = HTMLElement>(id: string) {
  const elementRef = React.useRef<TElement>();

  React.useEffect(() => {
    if (elementRef.current) {
      const list = new Trap(elementRef.current, { id });
      return () => list.dispose();
    }
  }, [id]);

  return elementRef;
}