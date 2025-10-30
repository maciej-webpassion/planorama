import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

import { effect } from '@preact/signals-core';

import { STAGE_NAME } from '../config/config.const';
import { emit } from '../store/event-bus';
import {
  ItemConfig,
  setCreatorCurrentItemConfig,
  setItemGap,
  setItemRotationAngle,
  setOnItemMouseClick,
  setOnItemMouseOut,
  setOnItemMouseOver,
} from '../store/item';
import { setSpreadByOpts, SpreadByOpts } from '../store/select';
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
  onItemMouseClick?: (item: any) => void;
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
  discardSelection: () => void;
  deleteSelectedItems: () => void;
  cloneSelectedItems: () => void;
}

export type { Vector2d } from 'konva/lib/types';

let stage: Stage;
export const setStage = (config: PlanoramaConfig): Planorama => {
  const { stageContainer, onViewportChange, onViewModeChange, onItemMouseOver, onItemMouseOut, onItemMouseClick } =
    config;

  if (onItemMouseOver) {
    onItemMouseOver && setOnItemMouseOver(onItemMouseOver);
  }

  if (onItemMouseOut) {
    onItemMouseOut && setOnItemMouseOut(onItemMouseOut);
  }

  if (onItemMouseClick) {
    onItemMouseClick && setOnItemMouseClick(onItemMouseClick);
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
      setStageDraggableWithMode(stage, onViewModeChange);
    });
  }

  function setStageScale(scale: Vector2d) {
    setScaleValue(scale);
  }

  function setStageMode(mode: StageMode) {
    setModeValue(mode);
  }

  function setSpreadOpts(opts: SpreadByOpts) {
    setSpreadByOpts(opts);
  }

  function setCreatorCurrentItem(config: ItemConfig) {
    setCreatorCurrentItemConfig(config);
  }

  return {
    stage,
    setStageScale,
    setStageMode,
    setXAlignment: () => emit('select:action:alignX'),
    setYAlignment: () => emit('select:action:alignY'),
    spreadItemsByCircle: () => emit('select:action:spreadCircle'),
    setRotation: () => emit('select:action:rotate'),
    discardSelection: () => emit('select:action:discardSelection'),
    deleteSelectedItems: () => emit('select:action:deleteSelectedItems'),
    cloneSelectedItems: () => emit('select:action:cloneSelectedItems'),
    setSpreadOpts,
    setCreatorCurrentItem,
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
    name: STAGE_NAME,
  });
}

export function setStageDraggableWithMode(stage: Stage, onViewModeChange?: (mode: StageMode) => void) {
  const mode = getModeValue();
  onViewModeChange?.(mode);
  stage.draggable(mode === 'viewport' ? true : false);
}
