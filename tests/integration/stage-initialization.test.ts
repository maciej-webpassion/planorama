import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Stage } from 'konva/lib/Stage';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { emit, getModeValue, getScaleValue, on, setModeValue, setScaleValue } from '@/core/state';
import { cleanupStage, createMockLayer, createMockStage } from '@tests/helpers/konva-mocks';

describe('Stage Initialization Integration', () => {
  let stage: Stage;
  let backgroundLayer: Layer;
  let itemsLayer: Layer;

  beforeEach(() => {
    stage = createMockStage({ width: 1000, height: 800 });
    backgroundLayer = createMockLayer();
    itemsLayer = createMockLayer();
    stage.add(backgroundLayer);
    stage.add(itemsLayer);

    // Reset state
    setModeValue('viewport');
    setScaleValue({ x: 1, y: 1 });
  });

  afterEach(() => {
    cleanupStage(stage);
  });

  describe('Stage Setup', () => {
    it('should initialize stage with correct dimensions', () => {
      expect(stage.width()).toBe(1000);
      expect(stage.height()).toBe(800);
    });

    it('should have multiple layers', () => {
      const layers = stage.getLayers();
      expect(layers.length).toBeGreaterThanOrEqual(2);
    });

    it('should start in viewport mode', () => {
      expect(getModeValue()).toBe('viewport');
    });

    it('should start with scale 1', () => {
      expect(getScaleValue()).toEqual({ x: 1, y: 1 });
    });
  });

  describe('Mode Switching', () => {
    it('should switch from viewport to select mode', () => {
      setModeValue('select');
      expect(getModeValue()).toBe('select');
    });

    it('should switch from viewport to create mode', () => {
      setModeValue('create');
      expect(getModeValue()).toBe('create');
    });

    it('should switch back to viewport mode', () => {
      setModeValue('select');
      setModeValue('viewport');
      expect(getModeValue()).toBe('viewport');
    });
  });

  describe('Item Creation', () => {
    it('should add items to items layer', () => {
      const item = new Group({ x: 100, y: 100, width: 50, height: 50 });
      const rect = new Rect({ width: 50, height: 50, fill: 'red' });
      item.add(rect);
      itemsLayer.add(item);

      const children = itemsLayer.getChildren();
      expect(children.length).toBe(1);
      expect(children[0]).toBe(item);
    });

    it('should create multiple items', () => {
      const items = [
        { x: 100, y: 100 },
        { x: 200, y: 200 },
        { x: 300, y: 300 },
      ];

      items.forEach((pos) => {
        const item = new Group({ x: pos.x, y: pos.y, width: 50, height: 50 });
        const rect = new Rect({ width: 50, height: 50, fill: 'blue' });
        item.add(rect);
        itemsLayer.add(item);
      });

      expect(itemsLayer.getChildren().length).toBe(3);
    });

    it('should position items at correct coordinates', () => {
      const item = new Group({ x: 150, y: 250, width: 50, height: 50 });
      const rect = new Rect({ width: 50, height: 50, fill: 'green' });
      item.add(rect);
      itemsLayer.add(item);

      expect(item.x()).toBe(150);
      expect(item.y()).toBe(250);
    });
  });

  describe('Viewport Operations', () => {
    it('should scale the stage', () => {
      const newScale = { x: 2, y: 2 };
      setScaleValue(newScale);

      expect(getScaleValue()).toEqual(newScale);
    });

    it('should emit viewport changing event', () => {
      let eventReceived = false;

      on('viewport:changing', () => {
        eventReceived = true;
      });

      emit('viewport:changing', {});

      expect(eventReceived).toBe(true);
    });

    it('should handle zoom in', () => {
      const currentScale = getScaleValue();
      const newScale = {
        x: currentScale.x * 1.1,
        y: currentScale.y * 1.1,
      };
      setScaleValue(newScale);

      expect(getScaleValue().x).toBeGreaterThan(1);
      expect(getScaleValue().y).toBeGreaterThan(1);
    });

    it('should handle zoom out', () => {
      setScaleValue({ x: 2, y: 2 });

      const currentScale = getScaleValue();
      const newScale = {
        x: currentScale.x * 0.9,
        y: currentScale.y * 0.9,
      };
      setScaleValue(newScale);

      expect(getScaleValue().x).toBeLessThan(2);
      expect(getScaleValue().y).toBeLessThan(2);
    });
  });

  describe('Event Bus Integration', () => {
    it('should communicate between components via event bus', () => {
      let receivedPayload: any = null;

      on('item:action:updateById', (payload) => {
        receivedPayload = payload;
      });

      const testPayload = { id: 'item-123', config: { name: 'Test' } };
      emit('item:action:updateById', testPayload);

      expect(receivedPayload).toEqual(testPayload);
    });

    it('should handle selection events', () => {
      let selectionDiscarded = false;

      on('select:action:discardSelection', () => {
        selectionDiscarded = true;
      });

      emit('select:action:discardSelection');

      expect(selectionDiscarded).toBe(true);
    });
  });

  describe('Layer Management', () => {
    it('should keep background layer at bottom', () => {
      const layers = stage.getLayers();
      expect(layers[0]).toBe(backgroundLayer);
    });

    it('should keep items layer above background', () => {
      const layers = stage.getLayers();
      const backgroundIndex = layers.indexOf(backgroundLayer);
      const itemsIndex = layers.indexOf(itemsLayer);

      expect(itemsIndex).toBeGreaterThan(backgroundIndex);
    });

    it('should be able to add more layers', () => {
      const transformLayer = createMockLayer();
      stage.add(transformLayer);

      expect(stage.getLayers().length).toBe(3);
    });
  });
});
