import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { Util } from 'konva/lib/Util';
import { orderBy } from 'lodash-es';

import { effect } from '@preact/signals-core';

import { ITEM_NAME, TRANSFORMER_PADDING } from '../../config/config.const';
import { getItemGap } from '../../store/item';
import { getAlignX } from '../../store/select';
import { getModeValue } from '../../store/stage';

let LAYER: Layer;

export const setSelector = (layer: Layer, itemsLayer: Layer, stage: Stage) => {
  console.log('setSelector');

  const { group, selectionRectangle, tr } = getHelperObjects();

  LAYER = layer;

  layer.add(group);
  layer.add(tr);
  layer.add(selectionRectangle);

  let x1: number, y1: number, x2: number, y2: number;
  let selecting = false;

  stage.on('mousedown touchstart', (e) => {
    if (tr.nodes().length && e.target.name() !== 'back' && e.target.name() !== 'rotater _anchor') {
      moveItemsBackToLayer(group, itemsLayer, tr, stage);
    }

    if (getModeValue() !== 'select') return;
    if (!['background', 'planorama-stage'].includes(e.target.name())) return;

    e.evt.preventDefault();
    x1 = stage.getRelativePointerPosition()!.x;
    y1 = stage.getRelativePointerPosition()!.y;
    x2 = stage.getRelativePointerPosition()!.x;
    y2 = stage.getRelativePointerPosition()!.y;

    selectionRectangle.width(0);
    selectionRectangle.height(0);
    selecting = true;
  });

  stage.on('mousemove touchmove', (e) => {
    if (getModeValue() !== 'select') return;
    if (!selecting) return;

    e.evt.preventDefault();
    x2 = stage.getRelativePointerPosition()!.x;
    y2 = stage.getRelativePointerPosition()!.y;

    selectionRectangle.setAttrs({
      visible: true,
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  });

  stage.on('mouseup touchend', (e) => {
    if (getModeValue() !== 'select' || tr.nodes().length > 0) return;

    // do nothing if we didn't start selection
    selecting = false;
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRectangle.visible(false);
    });

    const { intersected, notIntersected } = getSelected(stage, selectionRectangle);

    if (intersected.length > 0) {
      moveSelectedItemsToTransformer(group, itemsLayer, tr, intersected, notIntersected);
    }
  });

  // clicks should select/deselect shapes
  stage.on('click tap', function (e) {
    if (getModeValue() !== 'select') return;
    // if we are selecting with rect, do nothing
    if (selectionRectangle.visible()) {
      return;
    }

    // if click on empty area - remove all selections
    if (e.target === stage) {
      // tr.nodes([]);
      return;
    }
    console.log(e.target);

    if (e.target.hasName(ITEM_NAME)) {
      console.log('click on item');

      // tr.nodes([e.target]);
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName(ITEM_NAME)) {
      return;
    }
  });

  effect(() => {
    const v = getAlignX();
    if (v > 0) {
      alignItemX(tr, itemsLayer, stage);
    }
  });
};

function getSelected(stage: Stage, selectionRectangle: Rect): { intersected: Group[]; notIntersected: Group[] } {
  const output = {
    intersected: [] as Group[],
    notIntersected: [] as Group[],
  };

  const shapes = stage.find<Group>(`.${ITEM_NAME}`);
  const box = selectionRectangle.getClientRect();
  // return shapes.filter((shape) => Util.haveIntersection(box, shape.getClientRect())) as Shape<ShapeConfig>[];
  shapes.forEach((shape: Group) => {
    var intersected = Util.haveIntersection(box, shape.getClientRect());
    if (intersected) {
      output.intersected.push(shape);
    } else {
      output.notIntersected.push(shape);
    }
  });

  return output;
}

function getRotationSnaps(jump: number) {
  const snaps = [];
  for (let i = 0; i < 360; i += jump) {
    snaps.push(i);
  }
  return snaps;
}

function getHelperObjects() {
  const group = new Group();

  const selectionRectangle = new Rect({
    fill: 'rgba(78,191,255,0.1)',
    visible: false,
    // disable events to not interrupt with events
    listening: false,
    stroke: '#4ebfff',
    strokeWidth: 2,
    strokeScaleEnabled: false,
  });

  const tr = new Transformer({
    rotateAnchorOffset: 60,
    padding: TRANSFORMER_PADDING,
    resizeEnabled: false,
    useSingleNodeRotation: true,
    rotationSnaps: getRotationSnaps(10),
    shouldOverdrawWholeArea: true,
  });

  return {
    group,
    selectionRectangle,
    tr,
  };
}

function moveItemsBackToLayer(group: Group, itemsLayer: Layer, tr: Transformer, stage: Stage) {
  const items = [...group.getChildren()];
  items.forEach((shape) => {
    const transform = shape.getAbsoluteTransform(stage).decompose();
    shape.moveTo(itemsLayer);

    shape.setAttrs({
      ...transform,
      scaleX: 1,
      scaleY: 1,
    });
  });

  // reset group transforms
  resetGroupTransforms(group, tr);
}

function resetGroupTransforms(group: Group, tr: Transformer) {
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
}

function moveSelectedItemsToTransformer(
  group: Group,
  itemsLayer: Layer,
  tr: Transformer,
  intersected: Group[],
  notIntersected: Group[]
) {
  itemsLayer.removeChildren();
  intersected.forEach((node) => {
    group.add(node);
  });

  notIntersected.forEach((node) => {
    itemsLayer.add(node);
  });

  tr.nodes([group]);
  group.cache();
}

function alignItemX(tr: Transformer, itemsLayer: Layer, stage: Stage) {
  const nodes = tr.nodes();

  const rect = tr.getClientRect();

  if (nodes.length === 0) return;

  const group: Group = nodes[0] as Group;

  const items = [...group.getChildren()];

  // spread items by X axis
  const spreadGap = getItemGap(); // amount to spread items by

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

  /**
   * Y starting point - AVG from all items Y center pos, after transform
   */
  const Y_STARTING_POINT =
    items.reduce((acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return acc + box.y + box.height / 2;
    }, 0) / items.length;

  /**
   * X starting point - sum of all widths, divided by 2 added to selection rect center
   */
  const X_STARTING_POINT =
    rect.x +
    (rect.width + TRANSFORMER_PADDING) / 2 -
    items.reduce((acc, shape) => {
      const box = shape.getClientRect({ relativeTo: stage });
      return acc + box.width + spreadGap;
    }, 0) /
      2;

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
    return acc + box.width + spreadGap;
  }, 0);

  resetGroupTransforms(group, tr);

  // and select again
  // items.forEach((item) => {
  //   group.add(item);
  // });

  // tr.nodes([group]);
  // group.cache();
}
