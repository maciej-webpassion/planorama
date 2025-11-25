import { Group } from 'konva/lib/Group';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Tween } from 'konva/lib/Tween';

import { TransformAnimationSettings } from '../../../config/config.const';

export function resetGroupTransforms(group: Group, tr: Transformer) {
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
  console.log('reset group');
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
