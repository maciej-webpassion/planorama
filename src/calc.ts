import { Vector2d } from './core/services/stage.ts';

// Keyframe offsets for 0°, 90°, 180°, 270°
const rotationOffsets: Record<number, Vector2d> = {
  0: { x: -10, y: -30 },
  90: { x: -10, y: -10 },
  180: { x: -30, y: -10 },
  270: { x: -30, y: -30 },
};

/**
 * Linearly interpolate between two offsets
 */
function lerp(a: Vector2d, b: Vector2d, t: number): Vector2d {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

/**
 * Converts any angle to a translate(x,y) based on the four keyframes.
 */
export function getTranslateForRotation(angle: number): string {
  // Normalize angle to 0–360
  const a = ((angle % 360) + 360) % 360;

  // Find the two nearest key points
  const keys = [0, 90, 180, 270, 360]; // 360 == 0 to close the loop

  for (let i = 0; i < keys.length - 1; i++) {
    const start = keys[i];
    const end = keys[i + 1];

    if (a >= start && a <= end) {
      const t = (a - start) / (end - start);
      const offsetA = rotationOffsets[start];
      const offsetB = rotationOffsets[end % 360]; // 360 → 0

      const { x, y } = lerp(offsetA, offsetB, t);
      return `translate(${x}px, ${y}px)`;
    }
  }

  // Fallback — shouldn't be reached
  const { x, y } = rotationOffsets[0];
  return `translate(${x}px, ${y}px)`;
}
