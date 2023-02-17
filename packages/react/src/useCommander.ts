import * as React from 'react';
import { Commander } from '@focuskit/vanilla';

export function useCommander<TElement extends HTMLElement = HTMLElement>(id: string) {
  const elementRef = React.useRef<TElement>();

  React.useLayoutEffect(() => {
    if (elementRef.current) {
      const list = new Commander(elementRef.current);
      return () => list.dispose();
    }
  }, [id]);

  return elementRef;
}