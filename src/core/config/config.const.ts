import { Easings } from 'konva/lib/Tween';

export const ITEM_NAME = 'planorama-item';
export const ITEMS_LAYER_NAME = 'planorama-items-layer';
export const TRANSFORM_LAYER_NAME = 'planorama-transform-layer';
export const STAGE_NAME = 'planorama-stage';
export const BACKGROUND_LAYER_NAME = 'planorama-background-layer';

export const SELECTION_GROUP_NAME = 'planorama-selection-group';

export const TRANSFORMER_NAME = 'planorama-selection-transformer';
export const TRANSFORMER_PADDING = 10;
export const TRANSFORMER_OBJECT_NAMES = ['back', 'rotater _anchor'];

export const CREATOR_GROUP_NAME = 'planorama-creator-group';
export const CREATOR_ITEMS_GROUP_NAME = 'planorama-creator-items-group';

// export const MIN_STAGE_SCALE = 0.1;
// export const MAX_STAGE_SCALE = 4;

export interface TransformAnimationSettings {
  duration: number;
  easing: (t: any, b: any, c: any, d: any) => any;
}

export const TRANSFORM_ANIMATION_SETTINGS: TransformAnimationSettings = {
  duration: 0.2,
  easing: Easings.EaseInOut,
};

export const DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT = 100;
