import { effect, signal } from '@preact/signals-core';

type PlanoramaEvent =
  | 'select:action:alignX'
  | 'select:action:alignY'
  | 'select:action:alignInCols'
  | 'select:action:spreadCircle'
  | 'select:action:rotate'
  | 'select:action:discardSelection'
  | 'select:action:deleteSelectedItems'
  | 'select:action:cloneSelectedItems'
  | 'viewport:action:centerOnItem'
  | 'viewport:action:centerOnPos'
  | 'select:action:selectById'
  | 'select:action:transformChange'
  | 'select:action:transformEnd'
  | 'select:action:transformStart'
  | 'viewport:changing'
  | 'item:action:updateById';

type EventMap = {
  [K in PlanoramaEvent]: any;
};

const eventSignal = signal<{ type: string; payload?: any } | null>(null);

export function emit<T extends keyof EventMap>(type: T, payload?: EventMap[T]) {
  eventSignal.value = { type, payload };
}

export function on<T extends keyof EventMap>(type: T, handler: (payload: EventMap[T]) => void) {
  effect(() => {
    const event = eventSignal.value;
    if (event && event.type === type) {
      handler(event.payload);
    }
  });
}
