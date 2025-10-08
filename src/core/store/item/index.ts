import { Signal, signal } from '@preact/signals-core';

const DEFAULT_ITEM_GAP = 10;

export interface ItemConfig {
  name: string;
  width: number;
  height: number;
  src: string;
  scale: { x: number; y: number };
}

export const itemGap: Signal<number> = signal(DEFAULT_ITEM_GAP);
export const creatorCurrentItemConfig: Signal<ItemConfig | null> = signal(null);
export const creatorItemGroups: Signal<ItemConfig[]> = signal([]);
export const onItemMouseOver: Signal<(item: any) => void> = signal(() => {});

export const setItemGap = (value: number) => {
  itemGap.value = value;
};
export const getItemGap = (): number => itemGap.value;

export const setDefaultItemGap = () => {
  itemGap.value = DEFAULT_ITEM_GAP;
};

export const setCreatorCurrentItemConfig = (config: ItemConfig | null) => {
  creatorCurrentItemConfig.value = config;
};
export const getCreatorCurrentItemConfig = (): ItemConfig | null => creatorCurrentItemConfig.value;

export const setCreatorItemGroups = (groups: ItemConfig[]) => {
  creatorItemGroups.value = groups;
};
export const getCreatorItemGroups = (): ItemConfig[] => creatorItemGroups.value;

export const setOnItemMouseOver = (fn: (item: any) => void) => {
  onItemMouseOver.value = fn;
};
export const getOnItemMouseOver = (): ((item: any) => void) => onItemMouseOver.value;
