import { Stage } from 'konva/lib/Stage';

import { effect } from '@preact/signals-core';

import { getPositionValue, getScaleValue, setScaleAndPosValue } from '../store/stage';

let timeout: number;
let loopActive = false;
let STAGE: Stage;

export const setViewport = (stage: Stage, stageContainer: HTMLDivElement): void => {
  STAGE = stage;
  zoomStage(stage, 1.1);
  subscribeSizeChange(stage, stageContainer);

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
    }, 300);
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
  stage.on("wheel", (e) => {
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
}
