import { Group } from 'konva/lib/Group';

import { Signal, signal } from '@preact/signals-core';

import type {
  ItemBackgroundColorConfig,
  ItemConfig,
  ItemLabelConfig,
  ItemUpdatePayload,
  PlanoramaItem,
} from '../../../lib/types';

export type { ItemBackgroundColorConfig, ItemConfig, ItemLabelConfig, ItemUpdatePayload, PlanoramaItem };

export const DEFAULT_ITEM_GAP = 10;
export const DEFAULT_ITEM_COLUMNS = 3;
const DEFAULT_ITEM_ROTATION_ANGLE = 0;
export const DEFAULT_VERTICAL_ALIGNMENT = 50;
export const DEFAULT_HORIZONTAL_ALIGNMENT = 50;
export const DEFAULT_ITEM_LABEL_FONT_FAMILY = 'Arial';
export const DEFAULT_ITEM_CORNER_RADIUS = 8;

export const itemGap: Signal<number> = signal(DEFAULT_ITEM_GAP);
export const itemColumns: Signal<number> = signal(DEFAULT_ITEM_COLUMNS);
export const itemRotationAngle: Signal<number> = signal(DEFAULT_ITEM_ROTATION_ANGLE);

export const creatorCurrentItemConfig: Signal<ItemConfig | null> = signal(null);
export const creatorItems: Signal<ItemConfig[]> = signal([]);
export const onItemMouseOver: Signal<(item: any) => void> = signal(() => {});
export const onItemMouseOut: Signal<(item: any) => void> = signal(() => {});
export const onItemMouseClick: Signal<(item: any) => void> = signal(() => {});
export const onSelectItems: Signal<(items: Group[]) => void> = signal(() => {});

export const setItemGap = (value: number) => {
  itemGap.value = value;
};
export const getItemGap = (): number => itemGap.value;

export const setItemColumns = (value: number) => {
  itemColumns.value = value;
};
export const getItemColumns = (): number => itemColumns.value;

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

export const setCreatorItems = (items: ItemConfig[]) => {
  creatorItems.value = items;
};
export const getCreatorItems = (): ItemConfig[] => creatorItems.value;

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
