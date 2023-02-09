import { BaseEvent, FocusKitEventHandler, FocusKitEventHandlerState, Pipe } from "../types";

export function createPipe(...handlers: FocusKitEventHandler[]): Pipe {
  const stack: FocusKitEventHandler[] = handlers;

  const use: Pipe["use"] = (...handlers) => {
    stack.push(...handlers);
  }

  const handleEvent: Pipe["handleEvent"] = (event, state) =>{
    const execute = (index: number, event: CustomEvent<BaseEvent>, state: FocusKitEventHandlerState): FocusKitEventHandlerState => {
      if (index === stack.length) {
        return state;
      }

      const handler = stack[index];
      
      if (handler) {
        handler(event, state, () => execute(index + 1, event, state));
      }

      return state;
    }

    return execute(0, event, state);
  }

  return {
    use,
    handleEvent,
  };
}