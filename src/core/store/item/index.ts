import { Signal, signal } from '@preact/signals-core';

const DEFAULT_ITEM_GAP = 10;
const DEFAULT_ITEM_ROTATION_ANGLE = 30;

export interface ItemLabelConfig {
  defaultText?: string;
  fontSize: number;
  fontFamily: string;
  fillColor: string; // color
}

export interface ItemConfig {
  name: string;
  width: number;
  height: number;
  src: string;
  scale: { x: number; y: number };
  label?: ItemLabelConfig;
}

export const itemGap: Signal<number> = signal(DEFAULT_ITEM_GAP);
export const itemRotationAngle: Signal<number> = signal(DEFAULT_ITEM_ROTATION_ANGLE);

export const creatorCurrentItemConfig: Signal<ItemConfig | null> = signal(null);
export const creatorItemGroups: Signal<ItemConfig[]> = signal([]);
export const onItemMouseOver: Signal<(item: any) => void> = signal(() => {});
export const onItemMouseOut: Signal<(item: any) => void> = signal(() => {});
export const onItemMouseClick: Signal<(item: any) => void> = signal(() => {});

export const setItemGap = (value: number) => {
  itemGap.value = value;
};
export const getItemGap = (): number => itemGap.value;

export const setItemRotationAngle = (angle: number) => {
  itemRotationAngle.value = angle;
};
export const getItemRotationAngle = (): number => itemRotationAngle.value;

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

export const setOnItemMouseOut = (fn: (item: any) => void) => {
  onItemMouseOut.value = fn;
};
export const getOnItemMouseOut = (): ((item: any) => void) => onItemMouseOut.value;

export const setOnItemMouseClick = (fn: (item: any) => void) => {
  onItemMouseClick.value = fn;
};
export const getOnItemMouseClick = (): ((item: any) => void) => onItemMouseClick.value;
