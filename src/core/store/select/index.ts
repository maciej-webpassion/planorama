import { Signal, signal } from '@preact/signals-core';

export type RotationMode = 'outside' | 'inside' | null;

export interface SpreadByOpts {
  withRotation: RotationMode;
  radius: number;
}

export const alignX: Signal<number> = signal(0);
export const alignY: Signal<number> = signal(0);
export const spreadByCircle: Signal<number> = signal(0);
export const spreadByOpts: Signal<SpreadByOpts> = signal({
  withRotation: null,
  radius: 500,
});

/**
 * Increment alignX signal to trigger alignment effect
 */
export const setAlignX = () => {
  alignX.value += 1;
};
export const getAlignX = (): number => alignX.value;

/**
 * Increment alignY signal to trigger alignment effect
 */
export const setAlignY = () => {
  alignY.value += 1;
};
export const getAlignY = (): number => alignY.value;

/**
 * Increment spreadByCircle signal to trigger spread by circle effect
 */
export const setSpreadByCircle = () => {
  spreadByCircle.value += 1;
};
export const getSpreadByCircle = (): number => spreadByCircle.value;
export const setSpreadByOpts = (opts: SpreadByOpts) => {
  spreadByOpts.value = opts;
};
export const getSpreadByOpts = (): SpreadByOpts => spreadByOpts.value;
