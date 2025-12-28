import { describe, expect, it } from 'vitest';

describe('Alignment - Circle Spread', () => {
  describe('circle calculations', () => {
    it('should calculate points on a circle', () => {
      const radius = 100;
      const itemCount = 4;
      const angleStep = (2 * Math.PI) / itemCount;

      const positions = [];
      for (let i = 0; i < itemCount; i++) {
        const angle = i * angleStep;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        positions.push({ x, y });
      }

      // First point should be at (radius, 0)
      expect(positions[0].x).toBeCloseTo(radius, 1);
      expect(positions[0].y).toBeCloseTo(0, 1);

      // Second point should be at (0, radius)
      expect(positions[1].x).toBeCloseTo(0, 1);
      expect(positions[1].y).toBeCloseTo(radius, 1);
    });

    it('should distribute items evenly around circle', () => {
      const itemCount = 8;
      const angleStep = (2 * Math.PI) / itemCount;

      expect(angleStep).toBeCloseTo(Math.PI / 4, 5); // 45 degrees in radians
    });

    it('should handle different radius values', () => {
      const radii = [50, 100, 200, 500];
      const angle = 0;

      radii.forEach((radius) => {
        const x = Math.cos(angle) * radius;
        expect(x).toBe(radius);
      });
    });

    it('should calculate center offset for circle placement', () => {
      const centerX = 400;
      const centerY = 300;
      const radius = 150;
      const angle = Math.PI / 2; // 90 degrees

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      expect(x).toBeCloseTo(centerX, 1);
      expect(y).toBeCloseTo(centerY + radius, 1);
    });

    it('should handle rotation direction', () => {
      const radius = 100;
      const angle = Math.PI / 4; // 45 degrees

      // Clockwise (standard)
      const clockwise = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };

      // Counter-clockwise (negative angle)
      const counterClockwise = {
        x: Math.cos(-angle) * radius,
        y: Math.sin(-angle) * radius,
      };

      expect(clockwise.x).toBeCloseTo(70.71, 1);
      expect(clockwise.y).toBeCloseTo(70.71, 1);
      expect(counterClockwise.y).toBeCloseTo(-70.71, 1);
    });
  });

  describe('item rotation on circle', () => {
    it('should calculate rotation angle pointing to center', () => {
      const itemCount = 4;
      const angleStep = (2 * Math.PI) / itemCount;

      const rotations = [];
      for (let i = 0; i < itemCount; i++) {
        const angle = i * angleStep;
        // Rotation to face center would be angle + PI
        const rotation = (angle + Math.PI) * (180 / Math.PI);
        rotations.push(rotation);
      }

      expect(rotations[0]).toBeCloseTo(180, 1);
      expect(rotations[1]).toBeCloseTo(270, 1);
    });

    it('should calculate rotation angle pointing outward', () => {
      const itemCount = 4;
      const angleStep = (2 * Math.PI) / itemCount;

      const rotations = [];
      for (let i = 0; i < itemCount; i++) {
        const angle = i * angleStep;
        const rotation = angle * (180 / Math.PI);
        rotations.push(rotation);
      }

      expect(rotations[0]).toBeCloseTo(0, 1);
      expect(rotations[1]).toBeCloseTo(90, 1);
      expect(rotations[2]).toBeCloseTo(180, 1);
    });
  });

  describe('starting angle offset', () => {
    it('should apply starting angle offset', () => {
      const startAngle = Math.PI / 2; // Start at top
      const itemCount = 4;
      const angleStep = (2 * Math.PI) / itemCount;

      const firstItemAngle = startAngle;
      const x = Math.cos(firstItemAngle) * 100;
      const y = Math.sin(firstItemAngle) * 100;

      expect(x).toBeCloseTo(0, 1);
      expect(y).toBeCloseTo(100, 1);
    });

    it('should rotate all items by offset', () => {
      const offset = Math.PI / 4; // 45 degree offset
      const itemCount = 4;
      const angleStep = (2 * Math.PI) / itemCount;

      const angles = [];
      for (let i = 0; i < itemCount; i++) {
        angles.push(offset + i * angleStep);
      }

      expect(angles[0]).toBeCloseTo(Math.PI / 4, 5);
      expect(angles[1]).toBeCloseTo((3 * Math.PI) / 4, 5);
    });
  });
});
