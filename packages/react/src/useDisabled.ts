import * as React from 'react';
import { Disabled } from '@focuskit/vanilla';

export function useDisabled(id: string) {
  const instance = React.useRef<Disabled>();

  return React.useCallback((element: HTMLElement | null) => {
    if (element) {
      instance.current = new Disabled(element, { id });
    } else {
      instance.current?.dispose();
    }
  }, []);
}