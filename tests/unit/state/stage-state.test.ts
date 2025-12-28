import { beforeEach, describe, expect, it } from 'vitest';

import {
  getModeValue,
  getPositionValue,
  getScaleValue,
  mode,
  setModeValue,
  setPositionValue,
  setScaleAndPosValue,
  setScaleValue,
  stagePosition,
  stageScale,
} from '@/core/state/stage-state';

describe('Stage State', () => {
  beforeEach(() => {
    // Reset to default values
    setScaleValue({ x: 1, y: 1 });
    setPositionValue({ x: 0, y: 0 });
    setModeValue('viewport');
  });

  describe('scale', () => {
    it('should get and set scale value', () => {
      expect(getScaleValue()).toEqual({ x: 1, y: 1 });

      const newScale = { x: 2, y: 2 };
      setScaleValue(newScale);

      expect(getScaleValue()).toEqual(newScale);
      expect(stageScale.value).toEqual(newScale);
    });

    it('should handle fractional scale values', () => {
      const newScale = { x: 0.5, y: 0.5 };
      setScaleValue(newScale);

      expect(getScaleValue()).toEqual(newScale);
    });

    it('should handle different x and y scales', () => {
      const newScale = { x: 1.5, y: 2.5 };
      setScaleValue(newScale);

      expect(getScaleValue()).toEqual(newScale);
    });
  });

  describe('position', () => {
    it('should get and set position value', () => {
      const newPosition = { x: 100, y: 200 };
      setPositionValue(newPosition);

      expect(getPositionValue()).toEqual(newPosition);
      expect(stagePosition.value).toEqual(newPosition);
    });

    it('should handle negative positions', () => {
      const newPosition = { x: -50, y: -100 };
      setPositionValue(newPosition);

      expect(getPositionValue()).toEqual(newPosition);
    });

    it('should handle zero position', () => {
      const newPosition = { x: 0, y: 0 };
      setPositionValue(newPosition);

      expect(getPositionValue()).toEqual(newPosition);
    });
  });

  describe('mode', () => {
    it('should get and set mode value', () => {
      expect(getModeValue()).toBe('viewport');

      setModeValue('select');
      expect(getModeValue()).toBe('select');
      expect(mode.value).toBe('select');
    });

    it('should handle all mode values', () => {
      const modes = ['viewport', 'select', 'create'] as const;

      modes.forEach((testMode) => {
        setModeValue(testMode);
        expect(getModeValue()).toBe(testMode);
      });
    });
  });

  describe('setScaleAndPosValue', () => {
    it('should set both scale and position in batch', () => {
      const newPosition = { x: 150, y: 250 };
      const newScale = { x: 1.8, y: 1.8 };

      setScaleAndPosValue(newPosition, newScale);

      expect(getPositionValue()).toEqual(newPosition);
      expect(getScaleValue()).toEqual(newScale);
    });

    it('should batch update signals atomically', () => {
      const initialPosition = getPositionValue();
      const initialScale = getScaleValue();

      const newPosition = { x: 100, y: 100 };
      const newScale = { x: 2, y: 2 };

      setScaleAndPosValue(newPosition, newScale);

      // Both should be updated
      expect(getPositionValue()).not.toEqual(initialPosition);
      expect(getScaleValue()).not.toEqual(initialScale);
      expect(getPositionValue()).toEqual(newPosition);
      expect(getScaleValue()).toEqual(newScale);
    });
  });
});
