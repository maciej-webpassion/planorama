// wite a function that will spread items by circle

import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';

import { moveSelectedItemsToTransformer } from '../../items/selector';
import { resetGroupTransforms } from './common';

/**
 * Rotate selected items by angle
 * @param tr Transformer
 * @param itemsLayer Layer where items are
 * @param stage Stage
 */
export function rotateItems(rotateAngle: number, tr: Transformer, itemsLayer: Layer, stage: Stage) {
  const nodes = tr.nodes();

  if (nodes.length === 0) return;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  items.forEach((shape) => {
    const transform = shape.getAbsoluteTransform(stage).decompose();
    shape.moveTo(itemsLayer);
    // Apply attributes to count bounding box
    shape.setAttrs({
      ...transform,
      scaleX: 1,
      scaleY: 1,
      rotation: rotateAngle,
    });
  });

  resetGroupTransforms(group, tr);
  moveSelectedItemsToTransformer(group, tr, items as Group[]);
}
