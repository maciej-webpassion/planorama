import { Signal, signal } from '@preact/signals-core';

export const onCreatorStart: Signal<(item: any) => void> = signal(() => {});
export const onCreatorMove: Signal<(item: any) => void> = signal(() => {});
export const onCreatorEnd: Signal<(item: any) => void> = signal(() => {});

export const setOnCreatorStart = (fn: (item: any) => void) => {
  onCreatorStart.value = fn;
};
export const setOnCreatorMove = (fn: (item: any) => void) => {
  onCreatorMove.value = fn;
};
export const setOnCreatorEnd = (fn: (item: any) => void) => {
  onCreatorEnd.value = fn;
};

export const getOnCreatorStart = (): ((item: any) => void) => onCreatorStart.value;
export const getOnCreatorMove = (): ((item: any) => void) => onCreatorMove.value;
export const getOnCreatorEnd = (): ((item: any) => void) => onCreatorEnd.value;
