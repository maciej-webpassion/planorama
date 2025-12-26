import { Signal, signal } from '@preact/signals-core';

import type { RotationMode, SpreadByOpts } from '../../lib/types';

export type { RotationMode, SpreadByOpts };

export const spreadByOpts: Signal<SpreadByOpts> = signal({
  withRotation: null,
  radius: 500,
});

export const setSpreadByOpts = (opts: SpreadByOpts) => {
  spreadByOpts.value = opts;
};
export const getSpreadByOpts = (): SpreadByOpts => spreadByOpts.value;

const onTransformChange: Signal<(item: any) => void> = signal(() => {});
const onTransformEnd: Signal<(item: any) => void> = signal(() => {});
const onTransformStart: Signal<(item: any) => void> = signal(() => {});

export const setOnTransformChange = (callback: (item: any) => void) => {
  onTransformChange.value = callback;
};
export const setOnTransformEnd = (callback: (item: any) => void) => {
  onTransformEnd.value = callback;
};
export const setOnTransformStart = (callback: (item: any) => void) => {
  onTransformStart.value = callback;
};
export const getOnTransformChange = (): ((item: any) => void) => onTransformChange.value;
export const getOnTransformEnd = (): ((item: any) => void) => onTransformEnd.value;
export const getOnTransformStart = (): ((item: any) => void) => onTransformStart.value;
