import { List, Trap, TrapGroup, Commander, Disabled } from './src/api';

declare global {
  interface Window {
    FocusKit: {
      List: typeof List,
      Trap: typeof Trap,
      TrapGroup: typeof TrapGroup,
      Commander: typeof Commander,
      Disabled: typeof Disabled,
    };
  }
}
