/**
 * Naming constants for Konva objects
 * All Konva object names use the 'planorama-' prefix for consistency
 */

// ============================================================================
// Item Names
// ============================================================================

/** Main item group name */
export const ITEM_NAME = 'planorama-item';

/** Item background shape name */
export const ITEM_BACKGROUND_NAME = 'planorama-item-background';

/** Item label text name */
export const ITEM_LABEL_NAME = 'planorama-item-label';

/** Item actions rectangle name (for hover effects) */
export const ITEM_ACTIONS_RECT_NAME = 'planorama-item-actions-rect';

// ============================================================================
// Layer Names
// ============================================================================

/** Layer containing all items */
export const ITEMS_LAYER_NAME = 'planorama-items-layer';

/** Layer for transformation operations */
export const TRANSFORM_LAYER_NAME = 'planorama-transform-layer';

/** Background layer name */
export const BACKGROUND_LAYER_NAME = 'planorama-background-layer';

// ============================================================================
// Stage & Background Names
// ============================================================================

/** Main stage name */
export const STAGE_NAME = 'planorama-stage';

/** Background object name */
export const BACKGROUND_NAME = 'planorama-background';

// ============================================================================
// Selection & Transformer Names
// ============================================================================

/** Group containing selected items */
export const SELECTION_GROUP_NAME = 'planorama-selection-group';

/** Transformer for selected items */
export const TRANSFORMER_NAME = 'planorama-selection-transformer';

/** Padding around transformer in pixels */
export const TRANSFORMER_PADDING = 10;

/** Names of transformer objects to hide (back anchor, rotation anchor) */
export const TRANSFORMER_OBJECT_NAMES = ['back', 'rotater _anchor'];

// ============================================================================
// Creator Names
// ============================================================================

/** Main creator group name */
export const CREATOR_GROUP_NAME = 'planorama-creator-group';

/** Group containing creator items */
export const CREATOR_ITEMS_GROUP_NAME = 'planorama-creator-items-group';
