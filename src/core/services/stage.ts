import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';
import { Vector2d } from 'konva/lib/types';

import { effect } from '@preact/signals-core';

import { STAGE_NAME } from '../config/config.const';
import { setBackgroundConfig } from '../store/background';
import { setOnCreatorEnd, setOnCreatorMove, setOnCreatorStart } from '../store/creator/index';
import { setDebug } from '../store/debug';
import { emit } from '../store/event-bus';
import {
    getItemColumns, getItemGap, getItemRotationAngle, ItemConfig, ItemUpdatePayload, PlanoramaItem, setCreatorCurrentItemConfig, setCreatorItems, setItemColumns, setItemGap,
    setItemRotationAngle, setOnItemMouseClick, setOnItemMouseOut, setOnItemMouseOver, setOnSelectItems
} from '../store/item';
import { getSpreadByOpts, setOnTransformChange, setOnTransformEnd, setOnTransformStart, setSpreadByOpts, SpreadByOpts } from '../store/select';
import { getModeValue, getPositionValue, getScaleValue, setModeValue, setPositionValue, setScaleValue, StageMode } from '../store/stage';
import { setBackground } from './background';
import { setItemsLayer } from './items/items';
import { setViewport } from './viewport';

import type { Planorama, PlanoramaConfig } from '../../lib/types';
let stage: Stage;
export const setStage = (config: PlanoramaConfig): Planorama => {
  const {
    stageContainer,
    itemsConfig,
    backgroundConfig,
    debug = false,
    onViewportChange,
    onViewModeChange,
    onItemMouseOver,
    onItemMouseOut,
    onItemMouseClick,
    onItemsSelected,
    onCreatorStart,
    onCreatorMove,
    onCreatorEnd,
    onTransformChange,
    onTransformEnd,
    onTransformStart,
  } = config;

  onItemMouseOver && setOnItemMouseOver(onItemMouseOver);
  onItemMouseOut && setOnItemMouseOut(onItemMouseOut);
  onItemMouseClick && setOnItemMouseClick(onItemMouseClick);
  onItemsSelected && setOnSelectItems(onItemsSelected);
  onCreatorStart && setOnCreatorStart(onCreatorStart);
  onCreatorMove && setOnCreatorMove(onCreatorMove);
  onCreatorEnd && setOnCreatorEnd(onCreatorEnd);
  onTransformChange && setOnTransformChange(onTransformChange);
  onTransformEnd && setOnTransformEnd(onTransformEnd);
  onTransformStart && setOnTransformStart(onTransformStart);

  setDebug(debug);
  setCreatorItems(itemsConfig);
  setBackgroundConfig(backgroundConfig || null);

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

  return {
    stage,
    setStageScale: (scale: Vector2d) => setScaleValue(scale),
    setStageMode: (mode: StageMode) => setModeValue(mode),
    setStagePosition: (pos: Vector2d) => emit('viewport:action:centerOnPos', pos),
    centerStageOnObjectById: (id: string) => emit('viewport:action:centerOnItem', id),
    centerOnItems: () => emit('viewport:action:centerOnItems'),
    setXAlignment: (gap?: number) => emit('select:action:alignX', gap || getItemGap()),
    setYAlignment: (gap?: number) => emit('select:action:alignY', gap || getItemGap()),
    setAlignmentInCols: (cols?: number, gap?: number) =>
      emit('select:action:alignInCols', { cols: cols || getItemColumns(), gap: gap || getItemGap() }),
    spreadItemsByCircle: (spreadOpts?: SpreadByOpts) =>
      emit('select:action:spreadCircle', spreadOpts || getSpreadByOpts()),
    setRotation: (rotationAngle?: number) => emit('select:action:rotate', rotationAngle || getItemRotationAngle()),
    discardSelection: () => emit('select:action:discardSelection'),
    updateItemById: (itemId: string, updates: ItemUpdatePayload) =>
      emit('item:action:updateById', { ...updates, id: itemId }),
    selectItemsById: (ids: string[] | string) => emit('select:action:selectById', ids),
    exportAllItems: (callback: (items: PlanoramaItem[]) => void) => emit('item:action:exportAll', callback),
    importItems: (items: PlanoramaItem[]) => emit('item:action:importAll', items),
    deleteSelectedItems: () => emit('select:action:deleteSelectedItems'),
    cloneSelectedItems: () => emit('select:action:cloneSelectedItems'),
    setSpreadByOpts: (opts: SpreadByOpts) => setSpreadByOpts(opts),
    setCreatorCurrentItem: (config: ItemConfig) => setCreatorCurrentItemConfig(config),
    setGap: (gap: number) => {
      setItemGap(gap);
    },
    setColumns: (cols: number) => {
      setItemColumns(cols);
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
