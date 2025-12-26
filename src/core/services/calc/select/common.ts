import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Tween } from 'konva/lib/Tween';

import { TransformAnimationSettings } from '../../../config/defaults';
import { getDebug } from '../../../store/debug';
import { getOnTransformEnd } from '../../../store/select';
import { degToRad, getRotatedRectPoints } from '../../calc';
import { transformerToWindow } from '../utils';

export function resetGroupTransforms(group: Group, tr: Transformer) {
  const onTransformEnd = getOnTransformEnd();
  group.setAttrs({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  });
  group.clearCache();
  group.destroyChildren();
  tr.nodes([]);

  onTransformEnd && onTransformEnd(getTransformerState(tr));
}

export function setTransformTween(
  shape: Group | Shape<ShapeConfig>,
  transforms: { x?: number; y?: number; rotation?: number },
  animSettings: TransformAnimationSettings,
  callbackFn: () => void
) {
  new Tween({
    ...transforms,
    node: shape,
    duration: animSettings.duration,
    easing: animSettings.easing,
    onFinish: callbackFn,
  }).play();
}

export function getTransformerState(tr: Transformer) {
  const stage = tr.getStage()!;
  const canvasPos = tr.getAbsolutePosition(stage); // { x, y } in canvas coords

  const windowPos = transformerToWindow(stage, canvasPos);

  const rotation = tr.getAbsoluteRotation(); // degrees
  const scale = tr.scaleX(); // uniform scale
  if (getDebug()) console.log(scale);
  const width = tr.width() * scale;
  const height = tr.height() * scale;

  if (getDebug()) console.log(width, height);

  return {
    canvasPos,
    rotation,
    scale: stage.scaleX(),
    rectPoints: getRotatedRectPoints(windowPos.x, windowPos.y, width, height, degToRad(rotation)),
  };
}
