import { Signal, signal } from '@preact/signals-core';

import {
    DEFAULT_HORIZONTAL_ALIGNMENT, DEFAULT_ITEM_COLUMNS, DEFAULT_ITEM_CORNER_RADIUS, DEFAULT_ITEM_GAP, DEFAULT_ITEM_LABEL_FONT_FAMILY, DEFAULT_ITEM_ROTATION_ANGLE,
    DEFAULT_VERTICAL_ALIGNMENT
} from '../config/defaults';

import type {
  ItemBackgroundColorConfig,
  ItemConfig,
  ItemLabelConfig,
  ItemUpdatePayload,
  PlanoramaItem,
} from '../../lib/types';

export type { ItemBackgroundColorConfig, ItemConfig, ItemLabelConfig, ItemUpdatePayload, PlanoramaItem };
export {
  DEFAULT_HORIZONTAL_ALIGNMENT,
  DEFAULT_ITEM_COLUMNS,
  DEFAULT_ITEM_CORNER_RADIUS,
  DEFAULT_ITEM_GAP,
  DEFAULT_ITEM_LABEL_FONT_FAMILY,
  DEFAULT_ITEM_ROTATION_ANGLE,
  DEFAULT_VERTICAL_ALIGNMENT,
};

export const itemGap: Signal<number> = signal(DEFAULT_ITEM_GAP);
export const itemColumns: Signal<number> = signal(DEFAULT_ITEM_COLUMNS);
export const itemRotationAngle: Signal<number> = signal(DEFAULT_ITEM_ROTATION_ANGLE);

export const creatorCurrentItemConfig: Signal<ItemConfig | null> = signal(null);
export const creatorItems: Signal<ItemConfig[]> = signal([]);
export const onItemMouseOver: Signal<(item: PlanoramaItem) => void> = signal(() => {});
export const onItemMouseOut: Signal<(item: PlanoramaItem) => void> = signal(() => {});
export const onItemMouseClick: Signal<(item: PlanoramaItem) => void> = signal(() => {});
export const onSelectItems: Signal<(items: PlanoramaItem[]) => void> = signal(() => {});

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

export const setOnItemMouseOver = (fn: (item: PlanoramaItem) => void) => {
  onItemMouseOver.value = fn;
};
export const getOnItemMouseOver = (): ((item: PlanoramaItem) => void) => onItemMouseOver.value;

export const setOnItemMouseOut = (fn: (item: PlanoramaItem) => void) => {
  onItemMouseOut.value = fn;
};
export const getOnItemMouseOut = (): ((item: PlanoramaItem) => void) => onItemMouseOut.value;

export const setOnItemMouseClick = (fn: (item: PlanoramaItem) => void) => {
  onItemMouseClick.value = fn;
};
export const getOnItemMouseClick = (): ((item: PlanoramaItem) => void) => onItemMouseClick.value;

export const setOnSelectItems = (fn: (items: PlanoramaItem[]) => void) => {
  onSelectItems.value = fn;
};
export const getOnSelectItems = (): ((items: PlanoramaItem[]) => void) => onSelectItems.value;
