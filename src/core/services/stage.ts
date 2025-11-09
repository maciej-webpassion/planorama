import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

import { effect } from '@preact/signals-core';

import { STAGE_NAME } from '../config/config.const';
import { onCreatorStart, setOnCreatorEnd, setOnCreatorMove, setOnCreatorStart } from '../store/creator/index';
import { emit } from '../store/event-bus';
import {
  getItemGap,
  getItemRotationAngle,
  ItemConfig,
  setCreatorCurrentItemConfig,
  setItemGap,
  setItemRotationAngle,
  setOnItemMouseClick,
  setOnItemMouseOut,
  setOnItemMouseOver,
  setOnSelectItems,
} from '../store/item';
import { getSpreadByOpts, setSpreadByOpts, SpreadByOpts } from '../store/select';
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
  onItemsSelected?: (items: any[]) => void;
  onCreatorStart?: (data: any) => void;
  onCreatorMove?: (data: any) => void;
  onCreatorEnd?: (data: any) => void;
}

export interface Planorama {
  stage: Stage;
  setStageScale: (scale: Vector2d) => void;
  setStageMode: (mode: StageMode) => void;
  setXAlignment: (gap?: number) => void;
  setYAlignment: (gap?: number) => void;
  spreadItemsByCircle: (spreadOpts?: SpreadByOpts) => void;
  setSpreadByOpts: (opts: SpreadByOpts) => void;
  setCreatorCurrentItem: (config: ItemConfig) => void;
  setRotation: (rotationAngle?: number) => void;
  setRotationAngle: (angle: number) => void;
  setGap: (gap: number) => void;
  discardSelection: () => void;
  deleteSelectedItems: () => void;
  cloneSelectedItems: () => void;
}

export type { Vector2d } from 'konva/lib/types';

let stage: Stage;
export const setStage = (config: PlanoramaConfig): Planorama => {
  const {
    stageContainer,
    onViewportChange,
    onViewModeChange,
    onItemMouseOver,
    onItemMouseOut,
    onItemMouseClick,
    onItemsSelected,
    onCreatorStart,
    onCreatorMove,
    onCreatorEnd,
  } = config;

  onItemMouseOver && setOnItemMouseOver(onItemMouseOver);
  onItemMouseOut && setOnItemMouseOut(onItemMouseOut);
  onItemMouseClick && setOnItemMouseClick(onItemMouseClick);
  onItemsSelected && setOnSelectItems(onItemsSelected);
  onCreatorStart && setOnCreatorStart(onCreatorStart);
  onCreatorMove && setOnCreatorMove(onCreatorMove);
  onCreatorEnd && setOnCreatorEnd(onCreatorEnd);

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

  function setCreatorCurrentItem(config: ItemConfig) {
    setCreatorCurrentItemConfig(config);
  }

  return {
    stage,
    setStageScale,
    setStageMode,
    setXAlignment: (gap?: number) => emit('select:action:alignX', gap || getItemGap()),
    setYAlignment: (gap?: number) => emit('select:action:alignY', gap || getItemGap()),
    spreadItemsByCircle: (spreadOpts?: SpreadByOpts) =>
      emit('select:action:spreadCircle', spreadOpts || getSpreadByOpts()),
    setRotation: (rotationAngle?: number) => emit('select:action:rotate', rotationAngle || getItemRotationAngle()),
    discardSelection: () => emit('select:action:discardSelection'),
    deleteSelectedItems: () => emit('select:action:deleteSelectedItems'),
    cloneSelectedItems: () => emit('select:action:cloneSelectedItems'),
    setSpreadByOpts: (opts: SpreadByOpts) => setSpreadByOpts(opts),
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
