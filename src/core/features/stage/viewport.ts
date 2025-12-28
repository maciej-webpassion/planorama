import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { Easings } from 'konva/lib/Tween';
import { Vector2d } from 'konva/lib/types';

import { effect } from '@preact/signals-core';

import { ITEM_NAME, ITEMS_LAYER_NAME } from '../../config/constants';
import { emit, getDebug, getPositionValue, getScaleValue, on, setScaleAndPosValue } from '../../state';
import { getCenterOfBoundingBox } from '../../utils/transform';
import { setStageDraggableWithMode } from './';

let timeout: number;
let loopActive = false;
let STAGE: Stage;
const TOUCH_SCALE_ACCELERATION = 0;
const TIMEOUT_VALUE = 300;

export const setViewport = (stage: Stage, stageContainer: HTMLDivElement): void => {
  STAGE = stage;
  zoomStage(stage, 1);
  subscribeSizeChange(stage, stageContainer);

  // for the first 300 ms after initialization, user can set scale/position without animation
  setTimeout(() => {
    effect(() => {
      if (!loopActive) {
        loopActive = true;
        loop();
      } else {
        clearTimeout(timeout);
      }

      getScaleValue();
      getPositionValue();
      timeout = setTimeout(() => {
        loopActive = false;
      }, TIMEOUT_VALUE);
    });
  }, 300);

  on('viewport:action:centerOnItem', (id: string) => {
    centerStageOnObjectById(id);
  });

  on('viewport:action:centerOnPos', (pos: Vector2d) => {
    centerStageOnPos(pos);
  });

  on('viewport:action:centerOnItems', (duration: number) => {
    centerStageOnAllItems(duration);
  });
};

function subscribeSizeChange(stage: Stage, stageContainer: HTMLDivElement) {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentBoxSize) {
        fitStageIntoParentContainer(stage, stageContainer);
      }
    }
  });

  resizeObserver.observe(stageContainer);
}

function fitStageIntoParentContainer(stage: Stage, stageContainer: HTMLDivElement) {
  const containerWidth = stageContainer.offsetWidth;
  const containerHeight = stageContainer.offsetHeight;

  stage.width(containerWidth);
  stage.height(containerHeight);
}

function zoomStage(stage: Stage, scaleBy: number) {
  stage.on('wheel', (e) => {
    // stop default scrolling
    e.evt.preventDefault();

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) {
      return;
    }

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? -1 : 1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const acceleration = Math.abs(e.evt.deltaY) / 50;
    const scaleByAccelerated = scaleBy + acceleration;
    const newScale = direction > 0 ? oldScale * scaleByAccelerated : oldScale / scaleByAccelerated;

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScaleAndPosValue(newPos, { x: newScale, y: newScale });
  });

  function getDistance(p1: Vector2d, p2: Vector2d) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  function getCenter(p1: Vector2d, p2: Vector2d) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  function getNewScale(stage: Stage, dist: number, lastDist: number): number {
    let factor = dist / lastDist;

    if (factor > 1) {
      factor += TOUCH_SCALE_ACCELERATION;
    } else {
      factor -= TOUCH_SCALE_ACCELERATION;
    }

    return stage.scaleX() * factor;
  }

  let lastCenter: Vector2d | null = null;
  let lastDist = 0;

  stage.on('touchmove', function (e) {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      // if the stage was under Konva's drag&drop
      // we need to stop it, and implement our own pan logic with two pointers
      stage.draggable(false);

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastCenter) {
        lastCenter = getCenter(p1, p2);
        return;
      }

      const newCenter = getCenter(p1, p2);
      const dist = getDistance(p1, p2);

      if (getDebug()) console.log(dist);

      if (!lastDist) {
        lastDist = dist;
      }

      // local coordinates of center point
      const pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      };

      const scale = getNewScale(stage, dist, lastDist);

      // calculate new position of the stage
      const dx = newCenter.x - lastCenter.x;
      const dy = newCenter.y - lastCenter.y;

      const newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };

      setScaleAndPosValue(newPos, { x: scale, y: scale });

      lastDist = dist;
      lastCenter = newCenter;
    }
  });

  stage.on('touchend', function () {
    lastDist = 0;
    lastCenter = null;
    setStageDraggableWithMode(stage);
  });
}

function lerp(min: number, max: number, fraction: number) {
  return (max - min) * fraction + min;
}

function loop() {
  if (!loopActive) {
    return;
  }

  const fraction = 0.15;

  const scaleX = lerp(STAGE.scaleX(), getScaleValue().x, fraction);
  const scaleY = lerp(STAGE.scaleY(), getScaleValue().y, fraction);

  const posX = lerp(STAGE.x(), getPositionValue().x, fraction);
  const posY = lerp(STAGE.y(), getPositionValue().y, fraction);

  STAGE.scale({ x: scaleX, y: scaleY });
  STAGE.position({ x: posX, y: posY });

  requestAnimationFrame(loop);
  emit('viewport:changing');
}

function centerStageOnObjectById(id: string) {
  if (!STAGE) {
    return;
  }
  const obj = STAGE.findOne(`#${id}`);

  if (obj) {
    const center = getCenterOfBoundingBox(obj.getClientRect({ relativeTo: STAGE }));
    centerStageOnPos(center);
  } else {
    if (getDebug()) console.error('Object with id not found on stage:', id);
  }
}

function centerStageOnPos(pos: Vector2d) {
  if (!STAGE) {
    return;
  }

  const viewport = {
    width: STAGE.width(),
    height: STAGE.height(),
  };

  // Convert desired scene point into new stage position
  const newX = -pos.x * STAGE.scaleX() + viewport.width / 2;
  const newY = -pos.y * STAGE.scaleY() + viewport.height / 2;

  STAGE.to({
    x: newX,
    y: newY,
    duration: 0.2,
    easing: Easings.EaseInOut,
  });
}

function centerStageOnAllItems(isWithAnimation = 0) {
  if (!STAGE) {
    return;
  }

  const itemsLayer = STAGE.findOne('.' + ITEMS_LAYER_NAME) as Layer;
  if (!itemsLayer) {
    if (getDebug()) console.warn('Items layer not found');
    return;
  }

  const items = itemsLayer.find('.' + ITEM_NAME);
  if (!items || items.length === 0) {
    if (getDebug()) console.warn('No items found to center on');
    return;
  }

  // Calculate bounding box of all items
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  items.forEach((item) => {
    const rect = item.getClientRect({ relativeTo: STAGE });
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  });

  const boundingBox = {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };

  // Calculate center of all items
  const center = getCenterOfBoundingBox(boundingBox);

  // Calculate scale to fit all items with padding
  const viewport = {
    width: STAGE.width(),
    height: STAGE.height(),
  };

  const padding = 50; // Padding in pixels
  const scaleX = (viewport.width - padding * 2) / boundingBox.width;
  const scaleY = (viewport.height - padding * 2) / boundingBox.height;
  const newScale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1:1

  // Calculate position to center items at new scale
  const newX = -center.x * newScale + viewport.width / 2;
  const newY = -center.y * newScale + viewport.height / 2;

  // TODO: add optional animation
  if (!isWithAnimation) {
    STAGE.position({ x: newX, y: newY });
    STAGE.scale({ x: newScale, y: newScale });
    setScaleAndPosValue({ x: newX, y: newY }, { x: newScale, y: newScale });
    return;
  }

  STAGE.to({
    x: newX,
    y: newY,
    scaleX: newScale,
    scaleY: newScale,
    duration: isWithAnimation,
    easing: Easings.EaseInOut,
    onFinish: () => {
      setScaleAndPosValue({ x: newX, y: newY }, { x: newScale, y: newScale });
    },
  });
}
