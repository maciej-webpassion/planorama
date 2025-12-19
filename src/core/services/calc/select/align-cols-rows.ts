import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { orderBy } from 'lodash-es';

import { DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT, TRANSFORM_ANIMATION_SETTINGS } from '../../../config/config.const';
import { moveSelectedItemsToTransformer } from '../../items/selector';
import { resetGroupTransforms, setTransformTween } from './common';

/**
 * Align items in columns and rows
 * @param cols
 * @param spreadGap
 * @param tr
 * @param itemsLayer
 * @param stage
 * @returns
 */
export function alignItemsInCols(cols: number, spreadGap: number, tr: Transformer, itemsLayer: Layer, stage: Stage) {
  const animSettings = TRANSFORM_ANIMATION_SETTINGS;

  const nodes = tr.nodes();

  if (nodes.length === 0) return;
  const isWithAnimation = animSettings.duration > 0 || nodes.length <= DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  // Move items to layer and reset transforms
  items.forEach((shape) => {
    const transform = shape.getAbsoluteTransform(stage).decompose();
    shape.moveTo(itemsLayer);
    shape.setAttrs({
      ...transform,
      scaleX: 1,
      scaleY: 1,
    });
  });

  // Sort items by Y position first, then X position
  const sortedItems = orderBy(items, [
    (shape) => Math.min(shape.getClientRect({ relativeTo: stage }).y, shape.getAttr('y')),
    (shape) => Math.min(shape.getClientRect({ relativeTo: stage }).x, shape.getAttr('x')),
  ]);

  // Calculate grid dimensions
  const itemsPerRow = cols;
  const totalRows = Math.ceil(sortedItems.length / itemsPerRow);

  // Calculate row heights and column widths
  const rowHeights: number[] = [];
  const colWidths: number[] = [];

  for (let row = 0; row < totalRows; row++) {
    let maxHeight = 0;
    for (let col = 0; col < itemsPerRow; col++) {
      const index = row * itemsPerRow + col;
      if (index < sortedItems.length) {
        const box = sortedItems[index].getClientRect({ relativeTo: stage });
        maxHeight = Math.max(maxHeight, box.height);
        colWidths[col] = Math.max(colWidths[col] || 0, box.width);
      }
    }
    rowHeights.push(maxHeight);
  }

  // Calculate starting points
  const totalWidth = colWidths.reduce((sum, width) => sum + width, 0) + spreadGap * itemsPerRow;
  const X_STARTING_POINT = getXStartingPoint(sortedItems, stage) - totalWidth / 2;
  const Y_STARTING_POINT = getYStartingPoint(sortedItems, stage, spreadGap, cols);

  // Position items in grid
  sortedItems.forEach((shape, index) => {
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    const isLast = index === sortedItems.length - 1;

    const box = shape.getClientRect({ relativeTo: stage });

    // Calculate X position (center of column)
    const xOffset = colWidths.slice(0, col).reduce((sum, width) => sum + width + spreadGap, 0);
    const cx = box.x + box.width / 2;
    const xDiff = cx - shape.x();
    const xPos = X_STARTING_POINT + xOffset + colWidths[col] / 2 - xDiff;

    // Calculate Y position (center of row)
    const yOffset = rowHeights.slice(0, row).reduce((sum, height) => sum + height + spreadGap, 0);
    const cy = box.y + box.height / 2;
    const yDiff = cy - shape.y();
    const yPos = Y_STARTING_POINT + yOffset + rowHeights[row] / 2 - yDiff;

    if (!isWithAnimation) {
      shape.setAttrs({
        x: xPos,
        y: yPos,
      });
    } else {
      setTransformTween(
        shape,
        { x: xPos, y: yPos },
        animSettings,
        isLast
          ? () => {
              resetGroupTransforms(group, tr);
              moveSelectedItemsToTransformer(group, tr, sortedItems as Group[]);
            }
          : () => {}
      );
    }
  });

  if (!isWithAnimation) {
    resetGroupTransforms(group, tr);
    moveSelectedItemsToTransformer(group, tr, sortedItems as Group[]);
  }
}

/**
 * Calculates the average horizontal center point of a collection of shapes or groups.
 *
 * This function computes the mean x-coordinate by finding the center point (x + width/2)
 * of each item's bounding box relative to the stage, then averaging all center points.
 *
 * @param items - An array of Group or Shape objects to calculate the starting point from
 * @param stage - The Stage object used as reference for calculating relative client rectangles
 * @returns The average x-coordinate of all items' horizontal center points
 */
function getXStartingPoint(items: (Group | Shape<ShapeConfig>)[], stage: Stage): number {
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
function getYStartingPoint(items: (Group | Shape<ShapeConfig>)[], stage: Stage, gap: number, cols: number) {
  const [yAvg, heightAcc] = items.reduce(
    (acc, shape, index) => {
      // get every nth shape height sum
      if (index % cols !== 0) return acc;
      const box = shape.getClientRect({ relativeTo: stage });
      return [acc[0] + box.y + box.height / 2, acc[1] + box.height + gap];
    },
    [0, 0]
  );

  // column items count
  const columnItemsCount = Math.ceil(items.length / cols);

  return yAvg / columnItemsCount - (heightAcc - gap) / 2;
}
