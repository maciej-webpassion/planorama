import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Line } from 'konva/lib/shapes/Line';
import { Rect } from 'konva/lib/shapes/Rect';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

import { CREATOR_GROUP_NAME, CREATOR_ITEMS_GROUP_NAME } from '../../config/constants';
import { getCreatorCurrentItemConfig, getDebug, getItemGap, getItemRotationAngle, getModeValue, getOnCreatorEnd, getOnCreatorMove, getOnCreatorStart } from '../../state';
import { calculateDistance, calculateRotationAngle, degToRad, getRotatedRectPoints, nearestAngle } from '../calc';
import { stageToWindow } from '../calc/utils';
import { createItem } from './items';

export const setCreator = (layer: Layer, stage: Stage) => {
  let GAP = getItemGap();
  let ROTATION = getItemRotationAngle();
  let CURRENT_ITEM = getCreatorCurrentItemConfig();

  let isPaint = false;
  let lastLine: Line;
  let rect: Rect;
  let group: Group;
  let itemsGroup: Group;
  let itemsCount = 0;
  let lastPos: Vector2d | null = null;
  let itemWidth = 0;

  if (getDebug()) console.log('CURRENT_ITEM', CURRENT_ITEM);

  stage.on('mousedown touchstart', function () {
    if (getModeValue() !== 'create') return;
    GAP = getItemGap();
    ROTATION = getItemRotationAngle();
    CURRENT_ITEM = getCreatorCurrentItemConfig();
    if (!CURRENT_ITEM) return;

    itemWidth = CURRENT_ITEM.width + GAP;

    if (isPaint) {
      if (group) group.destroy();
      if (itemsGroup) itemsGroup.destroy();
    }

    isPaint = true;
    lastPos = stage.getRelativePointerPosition();
    if (!lastPos) return;

    lastLine = createHelperLine();
    rect = createCreatorRect(CURRENT_ITEM.height + 10, CURRENT_ITEM.height / 2 + GAP / 2);

    group = new Group({
      x: lastPos.x,
      y: lastPos.y,
      rotation: 0,
      name: CREATOR_GROUP_NAME,
    });

    itemsGroup = new Group({
      x: 0,
      y: 0,
      name: CREATOR_ITEMS_GROUP_NAME,
      offsetY: CURRENT_ITEM.height / 2,
      offsetX: -5,
    });

    group.add(lastLine);
    group.add(rect);
    group.add(itemsGroup);
    layer.add(group);

    const onCreatorStart = getOnCreatorStart();
    onCreatorStart && onCreatorStart(CURRENT_ITEM);
  });

  stage.on('mouseup touchend', function () {
    if (getModeValue() !== 'create') return;
    itemsGroup.find('Rect').forEach((item) => {
      const pos = item.getAbsolutePosition(this);
      const CURRENT_ITEM = getCreatorCurrentItemConfig();
      if (CURRENT_ITEM) {
        createItem(pos.x, pos.y, item.getAbsoluteRotation(), CURRENT_ITEM, stage);
      }
    });
    isPaint = false;
    group.destroy();
    itemsGroup.destroy();

    const onCreatorEnd = getOnCreatorEnd();
    onCreatorEnd && onCreatorEnd(CURRENT_ITEM);
  });

  // and core function - drawing
  stage.on('mousemove touchmove', function (e) {
    if (getModeValue() !== 'create') return;
    if (!CURRENT_ITEM) return;
    if (!isPaint) {
      return;
    }
    e.evt.preventDefault();

    // prevent scrolling on touch devices

    const pos = stage.getRelativePointerPosition();
    if (!pos || !lastPos) return;

    const rotation = nearestAngle(calculateRotationAngle(lastPos.x, lastPos.y, pos.x, pos.y));

    const width = calculateDistance(lastPos.x, lastPos.y, pos.x, pos.y);

    const count = Math.floor(width / itemWidth);
    if (count !== itemsCount) {
      itemsCount = count;
      itemsGroup.destroyChildren();
      for (let i = 0; i < count; i++) {
        itemsGroup.add(getItemRect(i * itemWidth, CURRENT_ITEM.width, CURRENT_ITEM.height, ROTATION));
      }
    }

    lastLine.points([0, 0, width, 0]);

    rect.width(width);
    group.rotation(rotation);

    const onCreatorMove = getOnCreatorMove();
    onCreatorMove && onCreatorMove({ ...getWindowPosition(stage, group, rotation), count, rotation });
  });
};

/**
 * Creates a rectangle used for item placement preview.
 * @param height
 * @param offsetY
 * @returns Rect
 */
function createCreatorRect(height: number, offsetY: number): Rect {
  return new Rect({
    x: 0,
    y: 0,
    width: 1,
    height,
    cornerRadius: 8,
    stroke: '#7592b6',
    strokeScaleEnabled: false,
    strokeWidth: 2,
    opacity: 0.9,
    offsetY,
    name: 'creator-rect',
  });
}

/**
 * Creates a helper line for item placement preview.
 * @returns Line
 */
function createHelperLine(): Line {
  return new Line({
    stroke: '#df4b26',
    strokeWidth: 2,
    globalCompositeOperation: 'source-over',
    // round cap for smoother lines
    lineCap: 'round',
    lineJoin: 'round',
    points: [0, 0],
  });
}

/**
 * Creates a rectangle for single item placement preview.
 * @param x
 * @param width
 * @param height
 * @returns Rect
 */
function getItemRect(x: number, width: number, height: number, rotation: number): Rect {
  return new Rect({
    x,
    y: 0,
    width,
    height,
    cornerRadius: 8,
    stroke: '#7592b6',
    strokeWidth: 1,
    rotation: rotation,
  });
}

function getWindowPosition(stage: Stage, group: Group, rotation: number) {
  const clonedGroup = group.clone();
  const rect = clonedGroup.findOne<Rect>('.creator-rect');
  if (!rect) {
    throw new Error('Creator rect not found');
  }
  rect.offsetY(0);
  rect.attrs.y = rect.attrs.y - rect.height() / 2;
  const rectPos = rect.getAbsolutePosition(stage);

  const { topLeft, topRight, bottomLeft, bottomRight, centerLeft, centerRight, centerTop, centerBottom, center } =
    getRotatedRectPoints(rectPos.x, rectPos.y, rect.attrs.width, rect.attrs.height, degToRad(rotation));

  return {
    topLeft: stageToWindow(stage, topLeft),
    bottomLeft: stageToWindow(stage, bottomLeft),
    topRight: stageToWindow(stage, topRight),
    bottomRight: stageToWindow(stage, bottomRight),
    centerLeft: stageToWindow(stage, centerLeft),
    centerRight: stageToWindow(stage, centerRight),
    centerTop: stageToWindow(stage, centerTop),
    centerBottom: stageToWindow(stage, centerBottom),
    center: stageToWindow(stage, center),
  };
}
