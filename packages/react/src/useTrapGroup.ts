import * as React from 'react';
import { TrapGroup } from '@focuskit/vanilla';

export function useTrapGroup<TElement extends HTMLElement = HTMLElement>(id: string) {
  const elementRef = React.useRef<TElement>();

  React.useEffect(() => {
    if (elementRef.current) {
      const list = new TrapGroup(elementRef.current, { id });
      return () => list.dispose();
    }
  }, [id]);

  return elementRef;
}