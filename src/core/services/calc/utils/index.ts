import { Stage } from 'konva/lib/Stage';
import { IRect } from 'konva/lib/types';

import { Vector2d } from '../../stage';

/**
 * Converts a point from stage coordinates to window coordinates.
 * @param stage - Konva stage instance
 * @param konvaPoint - point in stage coordinates
 * @param omitScale - if true, the stage scale will be omitted in the calculation
 * @returns point in window coordinates
 */
export function stageToWindow(stage: Stage, konvaPoint: Vector2d, omitScale = false): Vector2d {
  const rect = stage.container().getBoundingClientRect();
  const scale = stage.scale();
  const pos = stage.position();

  const scaleX = omitScale ? 1 : scale.x;
  const scaleY = omitScale ? 1 : scale.y;

  return {
    x: rect.left + (konvaPoint.x * scaleX + pos.x),
    y: rect.top + (konvaPoint.y * scaleY + pos.y),
  };
}

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

/**
 * Convert transformer point to window coordinates.
 * @param stage Stage
 * @param point
 * @returns
 */
export function transformerToWindow(stage: Stage, point: Vector2d): Vector2d {
  const rect = stage.container().getBoundingClientRect();

  return {
    x: rect.left + point.x,
    y: rect.top + point.y,
  };
}
