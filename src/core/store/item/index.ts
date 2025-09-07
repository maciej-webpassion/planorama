import { Signal, signal } from '@preact/signals-core';

const DEFAULT_ITEM_GAP = 10;

export const itemGap: Signal<number> = signal(DEFAULT_ITEM_GAP);

export const setItemGap = (value: number) => {
  itemGap.value = value;
};
export const getItemGap = (): number => itemGap.value;

export const setDefaultItemGap = () => {
  itemGap.value = DEFAULT_ITEM_GAP;
};
