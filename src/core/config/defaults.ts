import { Easings } from 'konva/lib/Tween';

/**
 * Default configuration values for Planorama
 * All default constants and settings are centralized here
 */

// ============================================================================
// Item Defaults
// ============================================================================

/**
 * Default gap between items in pixels
 */
export const DEFAULT_ITEM_GAP = 10;

/**
 * Default number of columns for item layout
 */
export const DEFAULT_ITEM_COLUMNS = 3;

/**
 * Default rotation angle for items in degrees
 */
export const DEFAULT_ITEM_ROTATION_ANGLE = 0;

/**
 * Default vertical alignment percentage for item labels (0-100)
 * 0 = top, 50 = center, 100 = bottom
 */
export const DEFAULT_VERTICAL_ALIGNMENT = 50;

/**
 * Default horizontal alignment percentage for item labels (0-100)
 * 0 = left, 50 = center, 100 = right
 */
export const DEFAULT_HORIZONTAL_ALIGNMENT = 50;

/**
 * Default font family for item labels
 */
export const DEFAULT_ITEM_LABEL_FONT_FAMILY = 'Arial';

/**
 * Default corner radius for item backgrounds in pixels
 */
export const DEFAULT_ITEM_CORNER_RADIUS = 8;

// ============================================================================
// Background Defaults
// ============================================================================

/**
 * Default scale for background images
 */
export const DEFAULT_BACKGROUND_SCALE = 1.9;

// ============================================================================
// Transform & Performance Defaults
// ============================================================================

/**
 * Maximum number of items before disabling animations for performance
 * When the number of selected items exceeds this limit, animations are disabled
 * to maintain smooth performance
 */
export const DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT = 100;

/**
 * Animation settings for transform operations (move, rotate, scale)
 */
export interface TransformAnimationSettings {
  /** Animation duration in seconds */
  duration: number;
  /** Easing function for smooth animations */
  easing: (t: any, b: any, c: any, d: any) => any;
}

/**
 * Default animation settings for transformations
 * - Duration: 0.2 seconds
 * - Easing: EaseInOut for smooth start and end
 */
export const TRANSFORM_ANIMATION_SETTINGS: TransformAnimationSettings = {
  duration: 0.2,
  easing: Easings.EaseInOut,
};

// ============================================================================
// Stage Defaults (commented out, kept for reference)
// ============================================================================

// /**
//  * Minimum zoom scale for the stage
//  */
// export const MIN_STAGE_SCALE = 0.1;

// /**
//  * Maximum zoom scale for the stage
//  */
// export const MAX_STAGE_SCALE = 4;
