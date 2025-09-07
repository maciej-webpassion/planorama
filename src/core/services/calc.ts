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
