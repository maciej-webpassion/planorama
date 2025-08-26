const ANGLE_JUMP = 5;

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

export function nearestAngle(angleDegrees: number) {
  if (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return Math.round(angleDegrees / ANGLE_JUMP) * ANGLE_JUMP;
}
