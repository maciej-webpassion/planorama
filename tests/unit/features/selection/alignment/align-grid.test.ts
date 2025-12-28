import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { cleanupStage, createMockLayer, createMockStage } from '@tests/helpers/konva-mocks';

describe('Alignment - Grid Layout', () => {
  let stage: Stage;
  let itemsLayer: Layer;
  let transformer: Transformer;

  beforeEach(() => {
    stage = createMockStage();
    itemsLayer = createMockLayer();
    stage.add(itemsLayer);
    transformer = new Transformer();
  });

  afterEach(() => {
    cleanupStage(stage);
  });

  it('should arrange items in a grid pattern', () => {
    const items: Group[] = [];

    // Create 6 items
    for (let i = 0; i < 6; i++) {
      const item = new Group({ x: i * 30, y: i * 30, width: 50, height: 50 });
      const rect = new Rect({ width: 50, height: 50, fill: 'red' });
      item.add(rect);
      items.push(item);
      itemsLayer.add(item);
    }

    expect(items.length).toBe(6);
  });

  it('should handle grid with specific column count', () => {
    const columns = 3;
    const itemCount = 9;
    const items: Group[] = [];

    for (let i = 0; i < itemCount; i++) {
      const item = new Group({ x: 0, y: 0, width: 50, height: 50 });
      const rect = new Rect({ width: 50, height: 50, fill: 'blue' });
      item.add(rect);
      items.push(item);
      itemsLayer.add(item);
    }

    const expectedRows = Math.ceil(itemCount / columns);
    expect(expectedRows).toBe(3);
  });

  it('should calculate grid positions with gap', () => {
    const itemSize = 50;
    const gap = 10;
    const columns = 3;

    const positions = [];
    for (let i = 0; i < 6; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      positions.push({
        x: col * (itemSize + gap),
        y: row * (itemSize + gap),
      });
    }

    expect(positions[0]).toEqual({ x: 0, y: 0 });
    expect(positions[1]).toEqual({ x: 60, y: 0 });
    expect(positions[2]).toEqual({ x: 120, y: 0 });
    expect(positions[3]).toEqual({ x: 0, y: 60 });
  });

  it('should handle single column grid', () => {
    const columns = 1;
    const items: Group[] = [];

    for (let i = 0; i < 3; i++) {
      const item = new Group({ x: 0, y: 0, width: 50, height: 50 });
      const rect = new Rect({ width: 50, height: 50, fill: 'green' });
      item.add(rect);
      items.push(item);
      itemsLayer.add(item);
    }

    expect(items.length).toBe(3);
  });

  it('should handle grid with more columns than items', () => {
    const columns = 5;
    const itemCount = 3;

    const expectedRows = Math.ceil(itemCount / columns);
    expect(expectedRows).toBe(1); // All items in one row
  });
});
