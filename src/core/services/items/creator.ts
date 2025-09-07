import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Line } from 'konva/lib/shapes/Line';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import { Stage } from 'konva/lib/Stage';

import { getItemGap } from '../../store/item';
import { getModeValue } from '../../store/stage';
import { calculateDistance, calculateRotationAngle, nearestAngle } from '../calc';
import { Vector2d } from '../stage';
import { createItem } from './items';

export const setCreator = (layer: Layer, stage: Stage) => {
  const gap = getItemGap();
  let isPaint = false;
  let lastLine: Line;
  let rect: Rect;
  let group: Group;
  let itemsGroup: Group;
  let itemsCount = 0;
  let lastPos: Vector2d | null = null;
  let text: Text;
  const itemWidth = 90 + gap;

  stage.on('mousedown touchstart', function () {
    if (getModeValue() !== 'create') return;

    if (isPaint) {
      if (group) group.destroy();
      if (itemsGroup) itemsGroup.destroy();
    }

    isPaint = true;
    lastPos = stage.getRelativePointerPosition();
    if (!lastPos) return;

    lastLine = new Line({
      stroke: '#df4b26',
      strokeWidth: 2,
      globalCompositeOperation: 'source-over',
      // round cap for smoother lines
      lineCap: 'round',
      lineJoin: 'round',
      points: [0, 0],
    });

    rect = new Rect({
      x: 0,
      y: 0,
      width: 1,
      height: 190,
      cornerRadius: 8,
      stroke: '#7592b6',
      strokeScaleEnabled: false,
      strokeWidth: 2,
      opacity: 0.9,
      offsetY: 95,
    });

    text = new Text({
      x: 0,
      y: 0,
      text: '12',
      fontSize: 30,
      fontFamily: 'Arial',
      fill: '#555',
      width: 100,
      padding: 0,
      align: 'left',
      offsetY: 120,
    });

    group = new Group({
      x: lastPos.x,
      y: lastPos.y,
      rotation: 0,
      name: 'planorama-creator-group',
    });

    itemsGroup = new Group({
      x: 0,
      y: 0,
      name: 'planorama-creator-items-group',
      offsetY: 90,
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
      createItem(pos.x, pos.y, item.getAbsoluteRotation());
    });
    isPaint = false;
    group.destroy();
    itemsGroup.destroy();
  });

  // and core function - drawing
  stage.on('mousemove touchmove', function (e) {
    if (getModeValue() !== 'create') return;
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
        const item = new Rect({
          x: i * itemWidth,
          y: 0,
          width: 90,
          height: 180,
          cornerRadius: 8,
          stroke: '#7592b6',
          strokeWidth: 1,
        });

        itemsGroup.add(item);
      }
    }

    lastLine.points([0, 0, width, 0]);

    rect.width(width);
    text.position({ x: width, y: 0 });
    text.text(String(count));
    group.rotation(rotation);
  });
};
