import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Line } from 'konva/lib/shapes/Line';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import { Stage } from 'konva/lib/Stage';

import { CREATOR_GROUP_NAME, CREATOR_ITEMS_GROUP_NAME } from '../../config/config.const';
import { getCreatorCurrentItemConfig, getItemGap } from '../../store/item';
import { getModeValue } from '../../store/stage';
import { calculateDistance, calculateRotationAngle, nearestAngle } from '../calc';
import { Vector2d } from '../stage';
import { createItem } from './items';

export const setCreator = (layer: Layer, stage: Stage) => {
  let GAP = getItemGap();
  let CURRENT_ITEM = getCreatorCurrentItemConfig();

  let isPaint = false;
  let lastLine: Line;
  let rect: Rect;
  let group: Group;
  let itemsGroup: Group;
  let itemsCount = 0;
  let lastPos: Vector2d | null = null;
  let text: Text;
  let itemWidth = 0;

  console.log('CURRENT_ITEM', CURRENT_ITEM);

  stage.on('mousedown touchstart', function () {
    if (getModeValue() !== 'create') return;
    GAP = getItemGap();
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
    rect = createCreatorRect(CURRENT_ITEM.height + 10, CURRENT_ITEM.height / 2 + 5);
    text = createHelperText(CURRENT_ITEM.height / 2 + 30);

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
    group.add(text);
    group.add(itemsGroup);
    layer.add(group);
  });

  stage.on('mouseup touchend', function () {
    if (getModeValue() !== 'create') return;
    itemsGroup.find('Rect').forEach((item) => {
      const pos = item.getAbsolutePosition(this);
      createItem(pos.x, pos.y, item.getAbsoluteRotation(), stage);
    });
    isPaint = false;
    group.destroy();
    itemsGroup.destroy();
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
        itemsGroup.add(getItemRect(i * itemWidth, CURRENT_ITEM.width, CURRENT_ITEM.height));
      }
    }

    lastLine.points([0, 0, width, 0]);

    rect.width(width);
    text.position({ x: width, y: 0 });
    text.text(String(count));
    group.rotation(rotation);
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
 * Creates a helper text for items count preview.
 * @param offsetY
 * @returns Text
 */
function createHelperText(offsetY: number): Text {
  return new Text({
    x: 0,
    y: 0,
    text: '12',
    fontSize: 30,
    fontFamily: 'Arial',
    fill: '#555',
    width: 100,
    padding: 0,
    align: 'left',
    offsetY,
  });
}

/**
 * Creates a rectangle for single item placement preview.
 * @param x
 * @param width
 * @param height
 * @returns Rect
 */
function getItemRect(x: number, width: number, height: number): Rect {
  return new Rect({
    x,
    y: 0,
    width,
    height,
    cornerRadius: 8,
    stroke: '#7592b6',
    strokeWidth: 1,
  });
}
