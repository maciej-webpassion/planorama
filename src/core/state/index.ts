/**
 * Central state management module
 * Re-exports all state modules for convenient imports
 */

// ============================================================================
// Background State
// ============================================================================
export type { BackgroundConfig } from './background-state';
export {
  backgroundConfig,
  getBackgroundConfig,
  getDefaultBackgroundConfig,
  setBackgroundConfig,
} from './background-state';

// ============================================================================
// Creator State
// ============================================================================
export {
  getOnCreatorEnd,
  getOnCreatorMove,
  getOnCreatorStart,
  onCreatorEnd,
  onCreatorMove,
  onCreatorStart,
  setOnCreatorEnd,
  setOnCreatorMove,
  setOnCreatorStart,
} from './creator-state';

// ============================================================================
// Debug State
// ============================================================================
export { getDebug, setDebug } from './debug-state';

// ============================================================================
// Event Bus
// ============================================================================
export { emit, on } from './event-bus';

// ============================================================================
// Item State
// ============================================================================
export type {
  ItemBackgroundColorConfig,
  ItemConfig,
  ItemLabelConfig,
  ItemUpdatePayload,
  PlanoramaItem,
} from './item-state';
export {
  creatorCurrentItemConfig,
  creatorItems,
  DEFAULT_HORIZONTAL_ALIGNMENT,
  DEFAULT_ITEM_COLUMNS,
  DEFAULT_ITEM_CORNER_RADIUS,
  DEFAULT_ITEM_GAP,
  DEFAULT_ITEM_LABEL_FONT_FAMILY,
  DEFAULT_ITEM_ROTATION_ANGLE,
  DEFAULT_VERTICAL_ALIGNMENT,
  getCreatorCurrentItemConfig,
  getCreatorItems,
  getItemColumns,
  getItemGap,
  getItemRotationAngle,
  getOnItemMouseClick,
  getOnItemMouseOut,
  getOnItemMouseOver,
  getOnSelectItems,
  itemColumns,
  itemGap,
  itemRotationAngle,
  onItemMouseClick,
  onItemMouseOut,
  onItemMouseOver,
  onSelectItems,
  setCreatorCurrentItemConfig,
  setCreatorItems,
  setDefaultItemGap,
  setItemColumns,
  setItemGap,
  setItemRotationAngle,
  setOnItemMouseClick,
  setOnItemMouseOut,
  setOnItemMouseOver,
  setOnSelectItems,
} from './item-state';

// ============================================================================
// Selection State
// ============================================================================
export type { RotationMode, SpreadByOpts } from './selection-state';
export {
  getOnTransformChange,
  getOnTransformEnd,
  getOnTransformStart,
  getSpreadByOpts,
  setOnTransformChange,
  setOnTransformEnd,
  setOnTransformStart,
  setSpreadByOpts,
  spreadByOpts,
} from './selection-state';

// ============================================================================
// Stage State
// ============================================================================
export type { StageMode } from './stage-state';
export {
  getModeValue,
  getPositionValue,
  getScaleValue,
  mode,
  setModeValue,
  setPositionValue,
  setScaleAndPosValue,
  setScaleValue,
  stagePosition,
  stageScale,
} from './stage-state';
