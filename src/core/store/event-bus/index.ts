import { effect, signal } from '@preact/signals-core';

type EventMap = Record<string, any>;

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
