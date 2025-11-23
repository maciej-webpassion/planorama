import { Group } from 'konva/lib/Group';

import { Signal, signal } from '@preact/signals-core';

export const DEFAULT_ITEM_GAP = 10;
const DEFAULT_ITEM_ROTATION_ANGLE = 0;
export const DEFAULT_VERTICAL_ALIGNMENT = 50;
export const DEFAULT_HORIZONTAL_ALIGNMENT = 50;
export const DEFAULT_ITEM_LABEL_FONT_FAMILY = 'Arial';
export const DEFAULT_ITEM_CORNER_RADIUS = 8;

export interface ItemLabelConfig {
  defaultText?: string;
  fontSize: number;
  fontFamily: string;
  // color
  fillColor: string;
  // percentage from top
  verticalAlignment?: number;
  // percentage from left
  horizontalAlignment?: number;
}

export interface ItemBackgroundColorConfig {
  // RGBA or hex color
  backgroundColor: string;
  // RGBA or hex color
  strokeColor: string;
  strokeWidth: number;
}

export interface ItemConfig {
  name: string;
  width: number;
  height: number;
  src: string;
  scale: { x: number; y: number };
  label?: ItemLabelConfig;
  background?: ItemBackgroundColorConfig;
}

export const itemGap: Signal<number> = signal(DEFAULT_ITEM_GAP);
export const itemRotationAngle: Signal<number> = signal(DEFAULT_ITEM_ROTATION_ANGLE);

export const creatorCurrentItemConfig: Signal<ItemConfig | null> = signal(null);
export const creatorItemGroups: Signal<ItemConfig[]> = signal([]);
export const onItemMouseOver: Signal<(item: any) => void> = signal(() => {});
export const onItemMouseOut: Signal<(item: any) => void> = signal(() => {});
export const onItemMouseClick: Signal<(item: any) => void> = signal(() => {});
export const onSelectItems: Signal<(items: Group[]) => void> = signal(() => {});

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

export const setOnSelectItems = (fn: (items: Group[]) => void) => {
  onSelectItems.value = fn;
};
export const getOnSelectItems = (): ((items: Group[]) => void) => onSelectItems.value;
