import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

import { effect } from '@preact/signals-core';

import {
  ItemConfig,
  setCreatorCurrentItemConfig,
  setItemGap,
  setItemRotationAngle,
  setOnItemMouseOut,
  setOnItemMouseOver,
} from '../store/item';
import { setAlignX, setAlignY, setRotate, setSpreadByCircle, setSpreadByOpts, SpreadByOpts } from '../store/select';
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
  onViewportChange?: (data: { scale: Vector2d; position: Vector2d }) => void;
  onViewModeChange?: (mode: StageMode) => void;
  onItemMouseOver?: (item: any) => void;
  onItemMouseOut?: (item: any) => void;
}

export interface Planorama {
  stage: Stage;
  setStageScale: (scale: Vector2d) => void;
  setStageMode: (mode: StageMode) => void;
  setXAlignment: () => void;
  setYAlignment: () => void;
  spreadItemsByCircle: () => void;
  setSpreadOpts: (opts: SpreadByOpts) => void;
  setCreatorCurrentItem: (config: ItemConfig) => void;
  setGap: (gap: number) => void;
  setRotation: () => void;
  setRotationAngle: (angle: number) => void;
}

export type { Vector2d } from 'konva/lib/types';

let stage: Stage;
export const setStage = (config: PlanoramaConfig): Planorama => {
  const { stageContainer, onViewportChange, onViewModeChange, onItemMouseOver, onItemMouseOut } = config;

  if (onItemMouseOver) {
    onItemMouseOver && setOnItemMouseOver(onItemMouseOver);
  }

  if (onItemMouseOut) {
    onItemMouseOut && setOnItemMouseOut(onItemMouseOut);
  }

  if (!stage) {
    stage = createStage(stageContainer);

    setViewport(stage, stageContainer);
    setBackground(stage);
    setItemsLayer(stage);

    effect(() => {
      onViewportChange?.({
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
      setStageDraggableWithMode(stage, onViewModeChange);
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

  function setYAlignment() {
    setAlignY();
  }

  function setRotation() {
    setRotate();
  }

  function spreadItemsByCircle() {
    setSpreadByCircle();
  }

  function setSpreadOpts(opts: SpreadByOpts) {
    setSpreadByOpts(opts);
  }

  function setCreatorCurrentItem(config: ItemConfig) {
    setCreatorCurrentItemConfig(config);
  }

  // const selectionActions = {
  //   setXAlignment: setXAlignment(),
  //   setYAlignment: setYAlignment(),
  // };

  return {
    stage,
    setStageScale,
    setStageMode,
    setXAlignment,
    setYAlignment,
    spreadItemsByCircle,
    setSpreadOpts,
    setCreatorCurrentItem,
    setRotation,
    setGap: (gap: number) => {
      setItemGap(gap);
    },
    setRotationAngle: (angle: number) => {
      setItemRotationAngle(angle);
    },
  };
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

export function setStageDraggableWithMode(stage: Stage, onViewModeChange?: (mode: StageMode) => void) {
  const mode = getModeValue();
  onViewModeChange?.(mode);
  stage.draggable(mode === 'viewport' ? true : false);
}
