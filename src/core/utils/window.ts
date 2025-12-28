import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

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
