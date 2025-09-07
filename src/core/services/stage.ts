import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

import { effect } from '@preact/signals-core';

import { setAlignX } from '../store/select';
import {
  getModeValue,
  getPositionValue,
  getScaleValue,
  setModeValue,
  setPositionValue,
  setScaleValue,
  StageMode,
} from '../store/stage';
import { setBackground } from './background';
import { setItemsLayer } from './items/items';
import { setViewport } from './viewport';

export interface PlanoramaConfig {
  stageContainer: HTMLDivElement;
  onViewportChange: (data: { scale: Vector2d; position: Vector2d }) => void;
}

export interface Planorama {
  stage: Stage;
  setStageScale: (scale: Vector2d) => void;
  setStageMode: (mode: StageMode) => void;
  setXAlignment: () => void;
}

export type { Vector2d } from 'konva/lib/types';

let stage: Stage;
export const setStage = (config: PlanoramaConfig): Planorama => {
  const { stageContainer, onViewportChange } = config;
  if (!stage) {
    stage = createStage(stageContainer);

    setViewport(stage, stageContainer);
    setBackground(stage);
    setItemsLayer(stage);

    effect(() => {
      onViewportChange({
        scale: getScaleValue(),
        position: getPositionValue(),
      });
    });

    // on mode change
    effect(() => {
      // const mode = getModeValue();
      // if (mode === "viewport") {
      //   stage.draggable(true);
      // } else {
      //   stage.draggable(false);
      // }
      setStageDraggableWithMode(stage);
    });
  }

  function setStageScale(scale: Vector2d) {
    setScaleValue(scale);
  }

  function setStageMode(mode: StageMode) {
    setModeValue(mode);
  }

  function setXAlignment() {
    setAlignX();
  }

  function setYAlignment(mode: StageMode) {
    setModeValue(mode);
  }

  // const selectionActions = {
  //   setXAlignment: setXAlignment(),
  //   setYAlignment: setYAlignment(),
  // };

  return { stage, setStageScale, setStageMode, setXAlignment };
};

function createStage(stageContainer: HTMLDivElement): Stage {
  return new Konva.Stage({
    container: stageContainer,
    width: stageContainer.offsetWidth,
    height: stageContainer.offsetHeight,
    draggable: true,
    dragBoundFunc: function (pos) {
      setPositionValue(pos);
      return this.getAbsolutePosition();
    },
    name: 'planorama-stage',
  });
}

export function setStageDraggableWithMode(stage: Stage) {
  const mode = getModeValue();
  stage.draggable(mode === 'viewport' ? true : false);
}
