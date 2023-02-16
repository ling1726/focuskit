import {
  List,
  Trap,
  TrapGroup,
  Commander,
  Disabled,
  ListGroup,
} from "./src/api";
import { EntityType, FocusKitFlags } from "./src/types";

declare global {
  interface Window {
    FocusKit: {
      List: typeof List;
      ListGroup: typeof ListGroup;
      Trap: typeof Trap;
      TrapGroup: typeof TrapGroup;
      Commander: typeof Commander;
      Disabled: typeof Disabled;
    };
  }

  interface HTMLElement {
    _focuskitFlags?: FocusKitFlags;
  }
}
