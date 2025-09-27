import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { orderBy } from 'lodash-es';

import { getItemGap } from '../../../store/item';
import { resetGroupTransforms } from './common';

/**
 * Align selected items horizontally
 * @param tr
 * @param itemsLayer
 * @param stage
 * @returns
 */
export function alignItemsX(tr: Transformer, itemsLayer: Layer, stage: Stage) {
  console.log('alignItemsX');
  const nodes = tr.nodes();

  if (nodes.length === 0) return;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  // spread items by X axis
  const SPREAD_GAP = getItemGap(); // amount to spread items by

  items.forEach((shape) => {
    const transform = shape.getAbsoluteTransform(stage).decompose();
    shape.moveTo(itemsLayer);
    // Apply attributes to count bounding box
    shape.setAttrs({
      ...transform,
      scaleX: 1,
      scaleY: 1,
    });
  });

  const Y_STARTING_POINT = getYStartingPoint(items, stage);
  const X_STARTING_POINT = getXStartingPoint(items, stage, SPREAD_GAP);

  const sortedItems = orderBy(items, (shape) =>
    Math.min(shape.getClientRect({ relativeTo: stage }).x, shape.getAttr('x'))
  );

  sortedItems.reduce((acc, shape) => {
    const box = shape.getClientRect({ relativeTo: stage });

    const cy = box.y + box.height / 2;
    const cx = box.x + box.width / 2;

    const yDiff = cy - shape.y();
    const yPos = Y_STARTING_POINT - yDiff;

    const xDiff = cx - shape.x();
    const xPos = X_STARTING_POINT + acc + (box.width / 2 - xDiff);
    shape.setAttrs({
      x: xPos,
      y: yPos,
    });
    return acc + box.width + SPREAD_GAP;
  }, 0);

  resetGroupTransforms(group, tr);

  // and select again
  // items.forEach((item) => {
  //   group.add(item);
  // });

  // tr.nodes([group]);
  // group.cache();
}

/**
 * Y starting point - AVG from all items Y center pos, after transform
 */
function getYStartingPoint(items: (Group | Shape<ShapeConfig>)[], stage: Stage) {
  return (
    items.reduce((acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return acc + box.y + box.height / 2;
    }, 0) / items.length
  );
}

/**
 * X starting point - AVG from all items X center pos, after transform
 */
function getXStartingPoint(items: (Group | Shape<ShapeConfig>)[], stage: Stage, gap: number) {
  const [xAvg, widthAcc] = items.reduce(
    (acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return [acc[0] + box.x + box.width / 2, acc[1] + box.width + gap];
    },
    [0, 0]
  );

  return xAvg / items.length - (widthAcc - gap) / 2;
}
