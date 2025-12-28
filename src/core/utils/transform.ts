import { IRect, Vector2d } from 'konva/lib/types';

/**
 * Get the center point of a bounding box.
 * @param boundingBox IRect | undefined
 * @returns Vector2d center point
 */
export function getCenterOfBoundingBox(boundingBox: IRect | undefined): Vector2d {
  if (!boundingBox) {
    return { x: 0, y: 0 };
  }
  return {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
}

const ANGLE_JUMP = 5;

/**
 * Calculate the distance between two points.
 * @param x1 - The x-coordinate of the first point.
 * @param y1 - The y-coordinate of the first point.
 * @param x2 - The x-coordinate of the second point.
 * @param y2 - The y-coordinate of the second point.
 * @returns The distance between the two points.
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  // Calculate the differences
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  // Calculate the squares of the differences
  const deltaXSquare = Math.pow(deltaX, 2);
  const deltaYSquare = Math.pow(deltaY, 2);

  // Sum the squares of the differences
  const sumOfSquares = deltaXSquare + deltaYSquare;

  // Take the square root of the sum to find the distance
  const distance = Math.sqrt(sumOfSquares);

  return distance;
}

/**
 * Calculate rotation angle between two points.
 * @param x1 - The x-coordinate of the first point.
 * @param y1 - The y-coordinate of the first point.
 * @param x2 - The x-coordinate of the second point.
 * @param y2 - The y-coordinate of the second point.
 * @returns Rotation angle between the two points.
 */
export function calculateRotationAngle(x1: number, y1: number, x2: number, y2: number) {
  // Calculate the differences
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  // Calculate the angle in radians
  const angleRadians = Math.atan2(deltaY, deltaX);

  // Convert the angle to degrees
  const angleDegrees = angleRadians * (180 / Math.PI);

  return angleDegrees;
}

/**
 * Get the nearest angle snap to the specified angle.
 * @param angleDegrees - The angle in degrees.
 * @returns The nearest angle snap.
 */
export function nearestAngle(angleDegrees: number) {
  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return Math.round(angleDegrees / ANGLE_JUMP) * ANGLE_JUMP;
}

/**
 * Get the center of a rotated rectangle.
 * @param x - The x-coordinate of the top left corner.
 * @param y - The y-coordinate of the top left corner.
 * @param width - The width of the rectangle.
 * @param height - The height of the rectangle.
 * @param angle - The rotation angle in radians.
 * @returns The center coordinates of the rotated rectangle.
 */
export function getRotatedRectCenter(
  x: number,
  y: number, // Top left corner
  width: number,
  height: number,
  angle: number // in radians
): { cx: number; cy: number } {
  // center of the rectangle before rotation
  const cx0 = x + width / 2;
  const cy0 = y + height / 2;

  // difference relative to the rotation point
  const dx = cx0 - x;
  const dy = cy0 - y;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // center after rotation
  const cx = x + dx * cos - dy * sin;
  const cy = y + dx * sin + dy * cos;

  return { cx, cy };
}

/**
 * Get all 4 corners and center points of a rotated rectangle.
 * @param x Top-left x
 * @param y Top-left y
 * @param width Rectangle width
 * @param height Rectangle height
 * @param angle Rotation angle (radians, use degToRad helper if needed)
 */
export function getRotatedRectPoints(x: number, y: number, width: number, height: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Helper to rotate a point (px,py) around (x,y)
  const rotate = (px: number, py: number) => {
    const dx = px - x;
    const dy = py - y;
    return {
      x: x + dx * cos - dy * sin,
      y: y + dx * sin + dy * cos,
    };
  };

  const topLeft = { x, y };
  const topRight = rotate(x + width, y);
  const bottomLeft = rotate(x, y + height);
  const bottomRight = rotate(x + width, y + height);
  const centerLeft = rotate(x, y + height / 2);
  const centerRight = rotate(x + width, y + height / 2);
  const centerTop = rotate(x + width / 2, y);
  const centerBottom = rotate(x + width / 2, y + height);
  const center = rotate(x + width / 2, y + height / 2);

  return { topLeft, topRight, bottomLeft, bottomRight, centerLeft, centerRight, centerTop, centerBottom, center };
}

/** Convert degrees to radians
 * @param deg Angle in degrees
 * @returns Angle in radians
 */
export const degToRad = (deg: number) => (deg * Math.PI) / 180;
