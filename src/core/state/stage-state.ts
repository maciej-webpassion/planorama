import { Vector2d } from 'konva/lib/types';

import { batch, Signal, signal } from '@preact/signals-core';

import type { StageMode } from '../../lib/types';

export type { StageMode };

export const stageScale: Signal<Vector2d> = signal({ x: 1, y: 1 });
export const stagePosition: Signal<Vector2d> = signal({ x: 1, y: 1 });
export const mode: Signal<StageMode> = signal('viewport');

export const setScaleAndPosValue = (pos: Vector2d, scale: Vector2d) => {
  batch(() => {
    stageScale.value = scale;
    stagePosition.value = pos;
  });
};

export const setScaleValue = (value: Vector2d) => {
  stageScale.value = value;
};
export const getScaleValue = (): Vector2d => stageScale.value;

export const setPositionValue = (value: Vector2d) => {
  stagePosition.value = value;
};
export const getPositionValue = (): Vector2d => stagePosition.value;

export const setModeValue = (value: StageMode) => {
  mode.value = value;
};

export const getModeValue = (): StageMode => mode.value;
