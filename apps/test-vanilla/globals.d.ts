import {
  List,
  Trap,
  TrapGroup,
  Commander,
  Disabled,
  ListGroup,
} from "@focuskit/vanilla";

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
}