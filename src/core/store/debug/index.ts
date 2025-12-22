import { Signal, signal } from '@preact/signals-core';

const debug: Signal<boolean> = signal(false);

export const setDebug = (value: boolean) => {
  debug.value = value;
};

export const getDebug = (): boolean => debug.value;
