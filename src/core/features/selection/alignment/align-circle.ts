// wite a function that will spread items by circle

import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';

import { DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT, TRANSFORM_ANIMATION_SETTINGS } from '../../../config/defaults';
import { SpreadByOpts } from '../../../state';
import { moveSelectedItemsToTransformer } from '../selection-manager';
import { resetGroupTransforms, setTransformTween } from '../transform/common';

/**
 * Spread selected items by circle
 * @param tr Transformer
 * @param itemsLayer Layer where items are
 * @param stage Stage
 */
export function spreadItemsByCircle(spreadOpts: SpreadByOpts, tr: Transformer, itemsLayer: Layer, stage: Stage) {
  const animSettings = TRANSFORM_ANIMATION_SETTINGS;

  const nodes = tr.nodes();

  if (nodes.length === 0) return;
  const isWithAnimation = animSettings.duration > 0 || nodes.length <= DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  items.forEach((shape) => {
    const transform = shape.getAbsoluteTransform(stage).decompose();
    shape.moveTo(itemsLayer);
    // Apply attributes to count bounding box
    shape.setAttrs({
      ...transform,
    });
  });

  const centerX = getXCenter(items, stage);
  const centerY = getYCenter(items, stage);
  const radius = spreadOpts.radius;

  const angleStep = (2 * Math.PI) / items.length;

  // all complicated calculations on invisible clones
  const clones = items.map((item) => item.clone().visible(false));

  if (spreadOpts.withRotation !== null) {
    clones.forEach((shape, index) => {
      // set rotation that item will be always look outside or inside
      let rotation = (index * (360 / items.length) + 90) % 360;

      if (spreadOpts.withRotation === 'inside') {
        rotation = (rotation + 180) % 360;
      }

      shape.setAttrs({
        rotation: rotation,
      });
    });
  }

  clones.forEach((shape, index) => {
    const angle = index * angleStep;

    const xPos = centerX + radius * Math.cos(angle);
    const yPos = centerY + radius * Math.sin(angle);

    const box = shape.getClientRect({ relativeTo: stage });
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    const xDiff = cx - shape.x();
    const yDiff = cy - shape.y();

    const x = xPos - xDiff;
    const y = yPos - yDiff;

    shape.setAttrs({
      x,
      y,
    });
  });

  items.forEach((shape, index, array) => {
    const isLast = index === array.length - 1;

    const clone = clones[index];
    const x = clone.x();
    const y = clone.y();
    let rotation = clone.rotation();

    if (normalizeAngle(rotation) === normalizeAngle(shape.rotation())) {
      rotation = shape.rotation();
    }

    if (!isWithAnimation) {
      shape.setAttrs({
        x,
        y,
        rotation,
      });
    } else {
      setTransformTween(
        shape,
        { x, y, rotation },
        animSettings,
        isLast
          ? () => {
              // after last item animation, update transformer
              resetGroupTransforms(group, tr);
              moveSelectedItemsToTransformer(group, tr, items as Group[]);
            }
          : () => {}
      );
    }
  });

  if (!isWithAnimation) {
    resetGroupTransforms(group, tr);
    moveSelectedItemsToTransformer(group, tr, items as Group[]);
  }

  clones.forEach((clone) => clone.destroy());
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

/**
 * Normalize angle to 0-360 range
 * @param angle
 * @returns
 */
export function normalize360(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Normalize angle to 0-360 range
 * @param angle
 * @returns
 */
function normalizeAngle(angle: number): number {
  const a = Math.round(angle);
  return normalize360(a);
}
