import { beforeEach, describe, expect, it } from 'vitest';

import {
  creatorCurrentItemConfig,
  creatorItems,
  DEFAULT_ITEM_COLUMNS,
  DEFAULT_ITEM_GAP,
  DEFAULT_ITEM_ROTATION_ANGLE,
  getItemColumns,
  getItemGap,
  itemColumns,
  itemGap,
  itemRotationAngle,
  setItemColumns,
  setItemGap,
  setItemRotationAngle,
} from '@/core/state/item-state';

describe('Item State', () => {
  beforeEach(() => {
    // Reset to default values
    setItemGap(DEFAULT_ITEM_GAP);
    setItemColumns(DEFAULT_ITEM_COLUMNS);
    setItemRotationAngle(DEFAULT_ITEM_ROTATION_ANGLE);
    creatorCurrentItemConfig.value = null;
    creatorItems.value = [];
  });

  describe('itemGap', () => {
    it('should have default value', () => {
      expect(getItemGap()).toBe(DEFAULT_ITEM_GAP);
    });

    it('should get and set item gap', () => {
      const newGap = 20;
      setItemGap(newGap);

      expect(getItemGap()).toBe(newGap);
      expect(itemGap.value).toBe(newGap);
    });

    it('should handle zero gap', () => {
      setItemGap(0);
      expect(getItemGap()).toBe(0);
    });

    it('should handle large gap values', () => {
      setItemGap(100);
      expect(getItemGap()).toBe(100);
    });
  });

  describe('itemColumns', () => {
    it('should have default value', () => {
      expect(getItemColumns()).toBe(DEFAULT_ITEM_COLUMNS);
    });

    it('should get and set item columns', () => {
      const newColumns = 5;
      setItemColumns(newColumns);

      expect(getItemColumns()).toBe(newColumns);
      expect(itemColumns.value).toBe(newColumns);
    });

    it('should handle single column', () => {
      setItemColumns(1);
      expect(getItemColumns()).toBe(1);
    });

    it('should handle many columns', () => {
      setItemColumns(10);
      expect(getItemColumns()).toBe(10);
    });
  });

  describe('itemRotationAngle', () => {
    it('should have default value', () => {
      expect(itemRotationAngle.value).toBe(DEFAULT_ITEM_ROTATION_ANGLE);
    });

    it('should get and set rotation angle', () => {
      const newAngle = 45;
      setItemRotationAngle(newAngle);

      expect(itemRotationAngle.value).toBe(newAngle);
    });

    it('should handle zero rotation', () => {
      setItemRotationAngle(0);
      expect(itemRotationAngle.value).toBe(0);
    });

    it('should handle negative rotation', () => {
      setItemRotationAngle(-45);
      expect(itemRotationAngle.value).toBe(-45);
    });

    it('should handle 360 degree rotation', () => {
      setItemRotationAngle(360);
      expect(itemRotationAngle.value).toBe(360);
    });
  });

  describe('creatorCurrentItemConfig', () => {
    it('should start as null', () => {
      expect(creatorCurrentItemConfig.value).toBeNull();
    });

    it('should store item config', () => {
      const config = {
        name: 'Test Item',
        width: 100,
        height: 100,
        src: 'test.png',
        scale: { x: 1, y: 1 },
      };

      creatorCurrentItemConfig.value = config;

      expect(creatorCurrentItemConfig.value).toEqual(config);
    });
  });

  describe('creatorItems', () => {
    it('should start as empty array', () => {
      expect(creatorItems.value).toEqual([]);
    });

    it('should store multiple item configs', () => {
      const items = [
        {
          name: 'Item 1',
          width: 100,
          height: 100,
          src: 'item1.png',
          scale: { x: 1, y: 1 },
        },
        {
          name: 'Item 2',
          width: 150,
          height: 150,
          src: 'item2.png',
          scale: { x: 1, y: 1 },
        },
      ];

      creatorItems.value = items;

      expect(creatorItems.value).toEqual(items);
      expect(creatorItems.value.length).toBe(2);
    });
  });
});
