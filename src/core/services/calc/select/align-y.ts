import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { orderBy } from 'lodash-es';

import { getItemGap } from '../../../store/item';
import { resetGroupTransforms } from './common';

/**
 * Align selected items vertically
 * @param tr
 * @param itemsLayer
 * @param stage
 * @returns
 */
export function alignItemsY(tr: Transformer, itemsLayer: Layer, stage: Stage) {
  console.log('alignItemsY');

  const nodes = tr.nodes();

  if (nodes.length === 0) return;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  // spread items by Y axis
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

  const Y_STARTING_POINT = getYStartingPoint(items, stage, SPREAD_GAP);
  const X_STARTING_POINT = getXStartingPoint(items, stage);

  const sortedItems = orderBy(items, (shape) =>
    Math.min(shape.getClientRect({ relativeTo: stage }).y, shape.getAttr('y'))
  );

  sortedItems.reduce((acc, shape) => {
    const box = shape.getClientRect({ relativeTo: stage });

    const cy = box.y + box.height / 2;
    const cx = box.x + box.width / 2;

    const xDiff = cx - shape.x();
    const xPos = X_STARTING_POINT - xDiff;

    const yDiff = cy - shape.y();
    const yPos = Y_STARTING_POINT + acc + (box.height / 2 - yDiff);

    shape.setAttrs({
      x: xPos,
      y: yPos,
    });

    return acc + box.height + SPREAD_GAP;
  }, 0);

  resetGroupTransforms(group, tr);
}

/**
 * X starting point - AVG from all items X center pos, after transform
 */
function getXStartingPoint(items: (Group | Shape<ShapeConfig>)[], stage: Stage) {
  return (
    items.reduce((acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return acc + box.x + box.width / 2;
    }, 0) / items.length
  );
}

/**
 * Y starting point - AVG from all items Y center pos, after transform
 */
function getYStartingPoint(items: (Group | Shape<ShapeConfig>)[], stage: Stage, gap: number) {
  const [yAvg, heightAcc] = items.reduce(
    (acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return [acc[0] + box.y + box.height / 2, acc[1] + box.height + gap];
    },
    [0, 0]
  );

  return yAvg / items.length - (heightAcc - gap) / 2;
}
