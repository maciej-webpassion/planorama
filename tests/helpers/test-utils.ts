import { Vector2d } from 'konva/lib/types';

/**
 * Compare two vectors with tolerance for floating point errors
 */
export function compareVectors(v1: Vector2d, v2: Vector2d, tolerance = 0.001): boolean {
  return Math.abs(v1.x - v2.x) < tolerance && Math.abs(v1.y - v2.y) < tolerance;
}

/**
 * Compare two numbers with tolerance
 */
export function compareNumbers(n1: number, n2: number, tolerance = 0.001): boolean {
  return Math.abs(n1 - n2) < tolerance;
}

/**
 * Create a mock image element
 */
export function createMockImage(width = 100, height = 100): HTMLImageElement {
  const img = new Image(width, height);
  img.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return img;
}

/**
 * Wait for a condition to be true
 */
export function waitFor(condition: () => boolean, timeout = 1000, interval = 10): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for condition after ${timeout}ms`));
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
}
