import { Stage } from 'konva/lib/Stage';
import { IRect } from 'konva/lib/types';

import { Vector2d } from '../../stage';

export function stageToWindow(stage: Stage, konvaPoint: Vector2d): { x: number; y: number } {
  const rect = stage.container().getBoundingClientRect();
  const scale = stage.scale();
  const pos = stage.position();

  return {
    x: rect.left + (konvaPoint.x * scale.x + pos.x),
    y: rect.top + (konvaPoint.y * scale.y + pos.y),
  };
}

export function getCenterOfBoundingBox(boundingBox: IRect | undefined): Vector2d {
  if (!boundingBox) {
    return { x: 0, y: 0 };
  }
  return {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
}
