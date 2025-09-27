// wite a function that will spread items by circle

import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { orderBy } from 'lodash-es';

import { getSpreadByOpts } from '../../../store/select';
import { resetGroupTransforms } from './common';

/**
 * Spread selected items by circle
 * @param tr Transformer
 * @param itemsLayer Layer where items are
 * @param stage Stage
 */
export function spreadItemsByCircle(tr: Transformer, itemsLayer: Layer, stage: Stage) {
  const nodes = tr.nodes();

  if (nodes.length === 0) return;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  const SPREAD_OPT = getSpreadByOpts();

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

  const centerX = getXCenter(items, stage);
  const centerY = getYCenter(items, stage);
  const radius = SPREAD_OPT.radius;

  const angleStep = (2 * Math.PI) / items.length;

  const sortedItems = orderBy(items, (shape) =>
    Math.min(shape.getClientRect({ relativeTo: stage }).x, shape.getAttr('x'))
  );

  if (SPREAD_OPT.withRotation !== null) {
    sortedItems.forEach((shape, index) => {
      // set rotation that item will be always look outside or inside
      let rotation = (index * (360 / items.length) + 90) % 360;

      if (SPREAD_OPT.withRotation === 'inside') {
        rotation = (rotation + 180) % 360;
      }

      shape.setAttrs({
        rotation: rotation,
      });
    });
  }

  sortedItems.forEach((shape, index) => {
    const angle = index * angleStep;

    const xPos = centerX + radius * Math.cos(angle);
    const yPos = centerY + radius * Math.sin(angle);

    const box = shape.getClientRect({ relativeTo: stage });
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    const xDiff = cx - shape.x();
    const yDiff = cy - shape.y();

    shape.setAttrs({
      x: xPos - xDiff,
      y: yPos - yDiff,
    });
  });

  resetGroupTransforms(group, tr);
}

/**
 * Y circle center - AVG from all items Y center pos, after transform
 */
function getYCenter(items: (Group | Shape<ShapeConfig>)[], stage: Stage) {
  return (
    items.reduce((acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return acc + box.y + box.height / 2;
    }, 0) / items.length
  );
}

/**
 * X circle center - AVG from all items X center pos, after transform
 */
function getXCenter(items: (Group | Shape<ShapeConfig>)[], stage: Stage) {
  return (
    items.reduce((acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return acc + box.x + box.width / 2;
    }, 0) / items.length
  );
}
