import { Signal, signal } from '@preact/signals-core';

export type RotationMode = 'outside' | 'inside' | null;

export interface SpreadByOpts {
  withRotation: RotationMode;
  radius: number;
}

export const spreadByOpts: Signal<SpreadByOpts> = signal({
  withRotation: null,
  radius: 500,
});

export const setSpreadByOpts = (opts: SpreadByOpts) => {
  spreadByOpts.value = opts;
};
export const getSpreadByOpts = (): SpreadByOpts => spreadByOpts.value;
