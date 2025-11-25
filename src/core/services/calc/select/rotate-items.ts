// wite a function that will spread items by circle

import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';

import { TRANSFORM_ANIMATION_SETTINGS } from '../../../config/config.const';
import { moveSelectedItemsToTransformer } from '../../items/selector';
import { resetGroupTransforms, setTransformTween } from './common';

/**
 * Rotate selected items by angle
 * @param tr Transformer
 * @param itemsLayer Layer where items are
 * @param stage Stage
 */
export function rotateItems(rotateAngle: number, tr: Transformer, itemsLayer: Layer, stage: Stage) {
  const animSettings = TRANSFORM_ANIMATION_SETTINGS;
  const nodes = tr.nodes();

  if (nodes.length === 0) return;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  items.forEach((shape, index, array) => {
    const isLast = index === array.length - 1;

    const transform = shape.getAbsoluteTransform(stage).decompose();
    shape.moveTo(itemsLayer);
    // Apply attributes to count bounding box
    if (animSettings.duration === 0) {
      shape.setAttrs({
        ...transform,
        rotation: rotateAngle,
      });
    } else {
      setTransformTween(
        shape,
        {
          ...transform,
          rotation: rotateAngle,
        },
        animSettings,
        isLast
          ? () => {
              resetGroupTransforms(group, tr);
              moveSelectedItemsToTransformer(group, tr, items as Group[]);
            }
          : () => {}
      );
    }
  });

  if (animSettings.duration === 0) {
    resetGroupTransforms(group, tr);
    moveSelectedItemsToTransformer(group, tr, items as Group[]);
  }
}
