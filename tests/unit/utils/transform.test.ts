import { describe, expect, it } from 'vitest';

import {
  calculateDistance,
  calculateRotationAngle,
  getCenterOfBoundingBox,
  getRotatedRectCenter,
  nearestAngle,
} from '@/core/utils/transform';

describe('Transform Utils', () => {
  describe('getCenterOfBoundingBox', () => {
    it('should calculate center of bounding box', () => {
      const boundingBox = {
        x: 0,
        y: 0,
        width: 100,
        height: 200,
      };

      const center = getCenterOfBoundingBox(boundingBox);

      expect(center).toEqual({ x: 50, y: 100 });
    });

    it('should handle offset bounding box', () => {
      const boundingBox = {
        x: 50,
        y: 75,
        width: 100,
        height: 200,
      };

      const center = getCenterOfBoundingBox(boundingBox);

      expect(center).toEqual({ x: 100, y: 175 });
    });

    it('should return {0, 0} for undefined bounding box', () => {
      const center = getCenterOfBoundingBox(undefined);

      expect(center).toEqual({ x: 0, y: 0 });
    });

    it('should handle square bounding box', () => {
      const boundingBox = {
        x: 10,
        y: 10,
        width: 50,
        height: 50,
      };

      const center = getCenterOfBoundingBox(boundingBox);

      expect(center).toEqual({ x: 35, y: 35 });
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const distance = calculateDistance(0, 0, 3, 4);

      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('should calculate horizontal distance', () => {
      const distance = calculateDistance(0, 0, 10, 0);

      expect(distance).toBe(10);
    });

    it('should calculate vertical distance', () => {
      const distance = calculateDistance(0, 0, 0, 10);

      expect(distance).toBe(10);
    });

    it('should return zero for same point', () => {
      const distance = calculateDistance(5, 5, 5, 5);

      expect(distance).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const distance = calculateDistance(-3, -4, 0, 0);

      expect(distance).toBe(5);
    });

    it('should calculate diagonal distance', () => {
      const distance = calculateDistance(0, 0, 10, 10);

      expect(distance).toBeCloseTo(14.142, 2);
    });
  });

  describe('calculateRotationAngle', () => {
    it('should calculate angle to the right (0 degrees)', () => {
      const angle = calculateRotationAngle(0, 0, 10, 0);

      expect(angle).toBe(0);
    });

    it('should calculate angle upward (90 degrees)', () => {
      const angle = calculateRotationAngle(0, 0, 0, 10);

      expect(angle).toBe(90);
    });

    it('should calculate angle to the left (180 degrees)', () => {
      const angle = calculateRotationAngle(0, 0, -10, 0);

      expect(angle).toBe(180);
    });

    it('should calculate angle downward (-90 degrees)', () => {
      const angle = calculateRotationAngle(0, 0, 0, -10);

      expect(angle).toBe(-90);
    });

    it('should calculate 45 degree angle', () => {
      const angle = calculateRotationAngle(0, 0, 10, 10);

      expect(angle).toBe(45);
    });

    it('should calculate 135 degree angle', () => {
      const angle = calculateRotationAngle(0, 0, -10, 10);

      expect(angle).toBe(135);
    });
  });

  describe('nearestAngle', () => {
    it('should snap to nearest 5 degree angle', () => {
      expect(nearestAngle(0)).toBe(0);
      expect(nearestAngle(2)).toBe(0);
      expect(nearestAngle(3)).toBe(5);
      expect(nearestAngle(7)).toBe(5);
      expect(nearestAngle(8)).toBe(10);
    });

    it('should handle larger angles', () => {
      expect(nearestAngle(47)).toBe(45);
      expect(nearestAngle(48)).toBe(50);
      expect(nearestAngle(90)).toBe(90);
    });

    it('should handle negative angles by converting to positive', () => {
      expect(nearestAngle(-5)).toBe(355);
      expect(nearestAngle(-90)).toBe(270);
      expect(nearestAngle(-180)).toBe(180);
    });

    it('should handle angles greater than 360', () => {
      expect(nearestAngle(362)).toBe(360);
      expect(nearestAngle(367)).toBe(365);
    });

    it('should snap exact multiples of 5', () => {
      expect(nearestAngle(45)).toBe(45);
      expect(nearestAngle(90)).toBe(90);
      expect(nearestAngle(180)).toBe(180);
      expect(nearestAngle(270)).toBe(270);
    });
  });

  describe('getRotatedRectCenter', () => {
    it('should calculate center of non-rotated rectangle', () => {
      const { cx, cy } = getRotatedRectCenter(0, 0, 100, 100, 0);

      expect(cx).toBe(50);
      expect(cy).toBe(50);
    });

    it('should calculate center with offset position', () => {
      const { cx, cy } = getRotatedRectCenter(10, 20, 100, 100, 0);

      expect(cx).toBe(60);
      expect(cy).toBe(70);
    });

    it('should handle 90 degree rotation (PI/2 radians)', () => {
      const { cx, cy } = getRotatedRectCenter(0, 0, 100, 100, Math.PI / 2);

      // When rotating around top-left corner (0,0), center moves from (50,50) to (-50,50)
      expect(cx).toBeCloseTo(-50, 1);
      expect(cy).toBeCloseTo(50, 1);
    });

    it('should handle different width and height', () => {
      const { cx, cy } = getRotatedRectCenter(0, 0, 200, 100, 0);

      expect(cx).toBe(100);
      expect(cy).toBe(50);
    });
  });
});
