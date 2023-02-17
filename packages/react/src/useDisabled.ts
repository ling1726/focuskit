import * as React from 'react';
import { Disabled } from '@focuskit/vanilla';

export function useDisabled<TElement extends HTMLElement = HTMLElement>(id: string) {
  const elementRef = React.useRef<TElement>();

  React.useEffect(() => {
    if (elementRef.current) {
      const list = new Disabled(elementRef.current, { id });
      return () => list.dispose();
    }
  }, [id]);

  return elementRef;
}