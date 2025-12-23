import { Signal, signal } from '@preact/signals-core';

import type { BackgroundConfig } from '../../../lib/types';

export type { BackgroundConfig };

const DEFAULT_BACKGROUND_SCALE = 1.9;

export const backgroundConfig: Signal<BackgroundConfig | null> = signal(null);

export const setBackgroundConfig = (config: BackgroundConfig | null) => {
  backgroundConfig.value = config;
};

export const getBackgroundConfig = (): BackgroundConfig | null => backgroundConfig.value;

export const getDefaultBackgroundConfig = (): BackgroundConfig => ({
  src: 'assets/bg-test.svg',
  scale: DEFAULT_BACKGROUND_SCALE,
});
