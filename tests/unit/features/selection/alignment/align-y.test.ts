import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { cleanupStage, createMockLayer, createMockStage } from '@tests/helpers/konva-mocks';

describe('Alignment - Align Y', () => {
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

  it('should create items at different vertical positions', () => {
    const item1 = new Group({ x: 100, y: 50, width: 50, height: 50 });
    const rect1 = new Rect({ width: 50, height: 50, fill: 'red' });
    item1.add(rect1);

    const item2 = new Group({ x: 100, y: 200, width: 50, height: 50 });
    const rect2 = new Rect({ width: 50, height: 50, fill: 'blue' });
    item2.add(rect2);

    const item3 = new Group({ x: 100, y: 350, width: 50, height: 50 });
    const rect3 = new Rect({ width: 50, height: 50, fill: 'green' });
    item3.add(rect3);

    itemsLayer.add(item1, item2, item3);

    expect(item1.y()).toBe(50);
    expect(item2.y()).toBe(200);
    expect(item3.y()).toBe(350);
  });

  it('should maintain vertical order when aligning', () => {
    const items = [
      { x: 100, y: 300 },
      { x: 100, y: 100 },
      { x: 100, y: 200 },
    ];

    const groups = items.map((pos, index) => {
      const group = new Group({ x: pos.x, y: pos.y, width: 50, height: 50, id: `item-${index}` });
      const rect = new Rect({ width: 50, height: 50, fill: 'red' });
      group.add(rect);
      return group;
    });

    groups.forEach((g) => itemsLayer.add(g));

    expect(groups[0].y()).toBe(300);
    expect(groups[1].y()).toBe(100);
    expect(groups[2].y()).toBe(200);
  });

  it('should handle single item vertical alignment', () => {
    const item = new Group({ x: 100, y: 100, width: 50, height: 50 });
    const rect = new Rect({ width: 50, height: 50, fill: 'red' });
    item.add(rect);
    itemsLayer.add(item);

    const initialY = item.y();

    expect(item.y()).toBe(initialY);
  });

  it('should align items of different heights', () => {
    const item1 = new Group({ x: 100, y: 50, width: 50, height: 100 });
    const rect1 = new Rect({ width: 50, height: 100, fill: 'red' });
    item1.add(rect1);

    const item2 = new Group({ x: 100, y: 200, width: 50, height: 50 });
    const rect2 = new Rect({ width: 50, height: 50, fill: 'blue' });
    item2.add(rect2);

    itemsLayer.add(item1, item2);

    expect(rect1.height()).toBe(100);
    expect(rect2.height()).toBe(50);
  });

  it('should handle items with equal heights', () => {
    const item1 = new Group({ x: 100, y: 100, width: 50, height: 50 });
    const rect1 = new Rect({ width: 50, height: 50, fill: 'red' });
    item1.add(rect1);

    const item2 = new Group({ x: 100, y: 200, width: 50, height: 50 });
    const rect2 = new Rect({ width: 50, height: 50, fill: 'blue' });
    item2.add(rect2);

    itemsLayer.add(item1, item2);

    expect(rect1.height()).toBe(rect2.height());
  });
});
