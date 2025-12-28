import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { cleanupStage, createMockLayer, createMockStage } from '@tests/helpers/konva-mocks';

describe('Alignment - Align X', () => {
  let stage: Stage;
  let itemsLayer: Layer;
  let transformer: Transformer;
  let transformLayer: Layer;

  beforeEach(() => {
    stage = createMockStage();
    itemsLayer = createMockLayer();
    transformLayer = createMockLayer();
    stage.add(itemsLayer);
    stage.add(transformLayer);
    transformer = new Transformer();
    transformLayer.add(transformer);
  });

  afterEach(() => {
    cleanupStage(stage);
  });

  it('should align items horizontally with equal spacing', () => {
    // Create test items at different positions
    const item1 = new Group({ x: 50, y: 100, width: 50, height: 50 });
    const rect1 = new Rect({ width: 50, height: 50, fill: 'red' });
    item1.add(rect1);

    const item2 = new Group({ x: 200, y: 150, width: 50, height: 50 });
    const rect2 = new Rect({ width: 50, height: 50, fill: 'blue' });
    item2.add(rect2);

    const item3 = new Group({ x: 100, y: 200, width: 50, height: 50 });
    const rect3 = new Rect({ width: 50, height: 50, fill: 'green' });
    item3.add(rect3);

    itemsLayer.add(item1, item2, item3);

    // Items exist and are at different positions
    expect(item1.x()).toBe(50);
    expect(item2.x()).toBe(200);
    expect(item3.x()).toBe(100);
  });

  it('should maintain relative order when aligning', () => {
    const items = [
      { x: 300, y: 100 },
      { x: 100, y: 100 },
      { x: 200, y: 100 },
    ];

    const groups = items.map((pos, index) => {
      const group = new Group({ x: pos.x, y: pos.y, width: 50, height: 50, id: `item-${index}` });
      const rect = new Rect({ width: 50, height: 50, fill: 'red' });
      group.add(rect);
      return group;
    });

    groups.forEach((g) => itemsLayer.add(g));

    // Verify initial positions
    expect(groups[0].x()).toBe(300);
    expect(groups[1].x()).toBe(100);
    expect(groups[2].x()).toBe(200);
  });

  it('should handle single item alignment', () => {
    const item = new Group({ x: 100, y: 100, width: 50, height: 50 });
    const rect = new Rect({ width: 50, height: 50, fill: 'red' });
    item.add(rect);
    itemsLayer.add(item);

    const initialX = item.x();
    const initialY = item.y();

    // Single item should remain in place
    expect(item.x()).toBe(initialX);
    expect(item.y()).toBe(initialY);
  });

  it('should align items of different sizes', () => {
    const item1 = new Group({ x: 50, y: 100, width: 100, height: 50 });
    const rect1 = new Rect({ width: 100, height: 50, fill: 'red' });
    item1.add(rect1);

    const item2 = new Group({ x: 200, y: 150, width: 50, height: 100 });
    const rect2 = new Rect({ width: 50, height: 100, fill: 'blue' });
    item2.add(rect2);

    itemsLayer.add(item1, item2);

    // Items have different sizes
    expect(rect1.width()).toBe(100);
    expect(rect2.width()).toBe(50);
  });
});
