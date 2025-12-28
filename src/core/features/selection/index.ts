/**
 * Selection feature module
 * Re-exports all selection-related functionality
 */

// ============================================================================
// Alignment
// ============================================================================
export { normalize360, spreadItemsByCircle } from './alignment/align-circle';
export { alignItemsInCols } from './alignment/align-grid';
export { alignItemsX } from './alignment/align-x';
export { alignItemsY } from './alignment/align-y';

// ============================================================================
// Transform
// ============================================================================
export { getTransformerState, resetGroupTransforms, setTransformTween } from './transform/common';
export { rotateItems } from './transform/rotate';

// ============================================================================
// Selection Manager
// ============================================================================
export { moveSelectedItemsToTransformer, setSelector } from './selection-manager';
