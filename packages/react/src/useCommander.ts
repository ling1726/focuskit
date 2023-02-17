import * as React from "react";
import { Commander } from "@focuskit/vanilla";

export function useCommander(targetDocument: Document | null | undefined) {
  React.useLayoutEffect(() => {
    if (targetDocument?.body && !targetDocument.body.hasAttribute("data-commander")) {
      const commander = new Commander(targetDocument.body);
      return () => commander.dispose();
    }

  }, [targetDocument]);
}
