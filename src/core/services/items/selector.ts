import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';
import { Util } from 'konva/lib/Util';

import {
    BACKGROUND_LAYER_NAME, DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT, ITEM_NAME, ITEMS_LAYER_NAME, SELECTION_GROUP_NAME, STAGE_NAME, TRANSFORMER_NAME, TRANSFORMER_OBJECT_NAMES,
    TRANSFORMER_PADDING
} from '../../config/config.const';
import { on } from '../../store/event-bus';
import { getOnSelectItems } from '../../store/item';
import { SpreadByOpts } from '../../store/select';
import { getModeValue } from '../../store/stage';
import { alignItemsX } from '../calc/select/align-x';
import { alignItemsY } from '../calc/select/align-y';
import { spreadItemsByCircle } from '../calc/select/circle-spread';
import { resetGroupTransforms } from '../calc/select/common';
import { rotateItems } from '../calc/select/rotate-items';

const STAGE_OBJECT_NAMES = [BACKGROUND_LAYER_NAME, STAGE_NAME];

export const setSelector = (layer: Layer, itemsLayer: Layer, stage: Stage) => {
  const { group, selectionRectangle, tr } = getHelperObjects();

  layer.add(group);
  layer.add(tr);
  layer.add(selectionRectangle);

  let x1: number, y1: number, x2: number, y2: number;
  let selecting = false;

  stage.on('mousedown touchstart', (e) => {
    stage.container().focus();
    debugCountItems(stage);

    if (tr.nodes().length && !TRANSFORMER_OBJECT_NAMES.includes(e.target.name())) {
      const targetParent = e?.target?.parent;
      if (targetParent?.hasName(ITEM_NAME)) {
        return;
      }
      moveItemsBackToLayer(group, itemsLayer, tr);
    }

    if (getModeValue() !== 'select') return;
    if (!STAGE_OBJECT_NAMES.includes(e.target.name())) return;

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

    const { intersected } = getSelected(stage, selectionRectangle);

    if (intersected.length > 0) {
      moveSelectedItemsToTransformer(group, tr, intersected);
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
      return;
    }

    const targetParent = e?.target?.getParent() as Group;

    // do nothing if clicked NOT on our rectangles
    if (!targetParent?.hasName(ITEM_NAME)) {
      return;
    }

    if (targetParent?.hasName(ITEM_NAME)) {
      let cleanupPreviousSelection = true;
      if (e.evt.ctrlKey || e.evt.metaKey) {
        cleanupPreviousSelection = false;
      }

      addItemToTransformer(tr, group, targetParent, itemsLayer, cleanupPreviousSelection);
    }
  });

  on('select:action:alignX', (gap: number) => {
    alignItemsX(gap, tr, itemsLayer, stage);
  });

  on('select:action:alignY', (gap: number) => {
    alignItemsY(gap, tr, itemsLayer, stage);
  });

  on('select:action:spreadCircle', (spreadOpts: SpreadByOpts) => {
    spreadItemsByCircle(spreadOpts, tr, itemsLayer, stage);
  });

  on('select:action:rotate', (rotateAngle: number) => {
    rotateItems(rotateAngle, tr, itemsLayer, stage);
  });

  on('select:action:discardSelection', () => {
    if (getModeValue() !== 'select') return;
    if (tr.nodes().length > 0) {
      moveItemsBackToLayer(group, itemsLayer, tr);
    }
  });

  on('select:action:deleteSelectedItems', () => {
    if (getModeValue() !== 'select') return;
    deleteSelectedItems(tr);
  });

  on('select:action:cloneSelectedItems', () => {
    if (getModeValue() !== 'select') return;
    cloneSelectedItems(group, itemsLayer, tr);
  });

  on('select:action:selectById', (ids: string[] | string) => {
    selectByIds(ids, stage, group, tr, itemsLayer);
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
  const group = new Group({
    name: SELECTION_GROUP_NAME,
  });

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
    rotationSnaps: getRotationSnaps(1),
    shouldOverdrawWholeArea: true,
    name: TRANSFORMER_NAME,
  });

  // TODO: check how to get position of Transformer while scale is changing
  // const trNode = tr.getClientRect(); doesn't work properly
  // we can use tr.getAbsoluteTransform().getTranslation() but it gives position without padding
  tr.on('transformstart', () => {
    // console.log('transform start');
  });

  tr.on('dragstart', () => {
    // console.log('transform drag start');
  });

  tr.on('dragmove', () => {
    // console.log('transform drag move');
  });

  tr.on('dragend', () => {
    // console.log('transform drag end');
  });

  tr.on('transform', (ev) => {
    // console.log('transforming', ev);

    console.log(tr.getAbsoluteTransform().decompose());
  });

  tr.on('transformend', () => {
    // console.log('transform end');
  });

  return {
    group,
    selectionRectangle,
    tr,
  };
}

function moveItemsBackToLayer(group: Group, itemsLayer: Layer, tr: Transformer) {
  const stage = tr.getStage()!;
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

export function moveSelectedItemsToTransformer(group: Group, tr: Transformer, selected: Group[]) {
  selected.forEach((node) => {
    node.remove();
    group.add(node);
  });

  setSelection(tr, group);
}

function addItemToTransformer(
  tr: Transformer,
  selectionGroup: Group,
  item: Group,
  itemsLayer: Layer,
  cleanupPreviousSelection: boolean
) {
  item.remove();
  if (cleanupPreviousSelection) {
    moveItemsBackToLayer(selectionGroup, itemsLayer, tr);
  }
  selectionGroup.add(item);

  setSelection(tr, selectionGroup);
}

function deleteSelectedItems(tr: Transformer) {
  if (getModeValue() !== 'select') return;
  const selectionGroup = tr.nodes() as Group[];

  if (selectionGroup.length > 0) {
    selectionGroup[0].getChildren().forEach((node) => {
      node.destroy();
    });
    resetGroupTransforms(selectionGroup[0], tr);
  }
}

function cloneSelectedItems(group: Group, itemsLayer: Layer, tr: Transformer) {
  const selectionGroupItems = group.getChildren().filter((child) => child.hasName(ITEM_NAME)) as Group[];

  if (selectionGroupItems.length > 0) {
    const clones: Group[] = [];

    moveItemsBackToLayer(group, itemsLayer, tr);
    resetGroupTransforms(group, tr);

    selectionGroupItems.forEach((node) => {
      const clone = node.clone({
        x: node.attrs.x + 20,
        y: node.attrs.y + 20,
      });

      clones.push(clone);
    });

    moveSelectedItemsToTransformer(group, tr, clones);
  }
}

function debugCountItems(stage: Stage) {
  const itemCount = stage.find(`.${ITEM_NAME}`).length;
  console.log('Total items on stage:', itemCount);

  const itemLayer = stage.findOne(`.${ITEMS_LAYER_NAME}`) as Layer;
  const itemLayerCount = itemLayer.find(`.${ITEM_NAME}`).length;
  console.log('Items in items layer:', itemLayerCount);

  const selectionGroup = stage.findOne(`.${SELECTION_GROUP_NAME}`) as Group;
  const selectionGroupCount = selectionGroup.find(`.${ITEM_NAME}`).length;
  console.log('Items in selection group:', selectionGroupCount);
}

function debugSelectedItems(group: Group[]) {
  const itemCount = group.length;
  console.log('Total items in selection group:', itemCount);
}

function setSelection(tr: Transformer, selectionGroup: Group) {
  const items = selectionGroup.getChildren().filter((child) => child.hasName(ITEM_NAME)) as Group[];
  const fn = getOnSelectItems();
  fn(items);

  debugSelectedItems(items);

  tr.nodes([selectionGroup]);
  if (items.length > DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT) {
    selectionGroup.cache();
  }

  if (items.length === 1) {
    tr.useSingleNodeRotation(true);

    tr.update();
  } else {
    tr.useSingleNodeRotation(false);
  }
}

function selectByIds(ids: string[] | string, stage: Stage, group: Group, tr: Transformer, itemsLayer: Layer) {
  const idsArray = Array.isArray(ids) ? ids : [ids];

  idsArray.forEach((id) => {
    const item = stage.findOne(`#${id}`) as Group;
    if (item) {
      addItemToTransformer(tr, group, item, itemsLayer, false);
    }
  });
}
