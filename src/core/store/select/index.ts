import { Signal, signal } from '@preact/signals-core';

export const alignX: Signal<number> = signal(0);
export const alignY: Signal<number> = signal(0);

export const setAlignX = () => {
  alignX.value += 1;
};
export const getAlignX = (): number => alignX.value;

export const setAlignY = (value: number) => {
  alignY.value = value;
};
export const getAlignY = (): number => alignY.value;
