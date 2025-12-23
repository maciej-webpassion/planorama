import { Stage } from 'konva/lib/Stage';
import { IRect, Vector2d } from 'konva/lib/types';

/**
 * 2D vector with x and y coordinates
 * Used for positions, scales, and dimensions
 */
export type { Vector2d } from 'konva/lib/types';

/**
 * Stage interaction mode
 * - 'select': Select and transform items
 * - 'create': Create new items
 * - 'viewport': Pan and zoom the stage
 */
export type StageMode = 'select' | 'create' | 'viewport';

/**
 * Rotation mode for circular spread
 * - 'outside': Items face outward from center
 * - 'inside': Items face inward to center
 * - null: No rotation applied
 */
export type RotationMode = 'outside' | 'inside' | null;

/**
 * Configuration for label text on items
 */
export interface ItemLabelConfig {
  /** Text content to display */
  text?: string;
  /** Default text when text is not provided */
  defaultText?: string;
  /** Font size in pixels */
  fontSize: number;
  /** Font family name */
  fontFamily: string;
  /** Text color (RGBA or hex) */
  fillColor: string;
  /** Vertical position as percentage from top (0-100) */
  verticalAlignment?: number;
  /** Horizontal position as percentage from left (0-100) */
  horizontalAlignment?: number;
}

/**
 * Configuration for item background appearance
 */
export interface ItemBackgroundColorConfig {
  /** Background fill color (RGBA or hex) */
  backgroundColor: string;
  /** Border color (RGBA or hex) */
  strokeColor: string;
  /** Border width in pixels */
  strokeWidth: number;
}

/**
 * Updates that can be applied to an existing item
 */
export interface ItemUpdatePayload {
  /** Item ID (auto-populated when using updateItemById) */
  id?: string;
  /** Partial background configuration to update */
  background?: Partial<ItemBackgroundColorConfig>;
  /** Partial label configuration to update */
  label?: Partial<ItemLabelConfig>;
}

/**
 * Configuration for the stage background image
 */
export interface BackgroundConfig {
  /** Path to SVG or image file */
  src: string;
  /** Scale factor to apply to the background */
  scale: number;

  offset?: Vector2d;
}

/**
 * Configuration for a type of item that can be created
 */
export interface ItemConfig {
  /** Unique name identifying this item type */
  name: string;
  /** Width in pixels (before scaling) */
  width: number;
  /** Height in pixels (before scaling) */
  height: number;
  /** Path to SVG or image file */
  src: string;
  /** Scale factor to apply to the item */
  scale: { x: number; y: number };
  /** Optional label configuration */
  label?: ItemLabelConfig;
  /** Optional background configuration */
  background?: ItemBackgroundColorConfig;
}

/**
 * Exported item data for serialization
 * Contains all information needed to recreate an item
 */
export interface PlanoramaItem {
  /** Unique identifier for this item instance */
  id: string;
  /** Item type (matches ItemConfig.name) */
  type: string;
  /** Current item properties (background, label) */
  itemProps: ItemUpdatePayload;
  /** Bounding box dimensions and position */
  boundingBox: IRect;
  /** Absolute position on stage */
  pos: Vector2d;
  /** Scale factor applied */
  scale: number;
  /** Center point of the item */
  itemCenter: Vector2d;
  /** Transform information (position and rotation) */
  transform: { x: number; y: number; rotation: number };
}

/**
 * Options for spreading items in a circle
 */
export interface SpreadByOpts {
  /** How items should be rotated when arranged in circle */
  withRotation: RotationMode;
  /** Circle radius in pixels */
  radius: number;
}

/**
 * Configuration object for initializing Planorama
 */
export interface PlanoramaConfig {
  /** HTML div element to contain the stage */
  stageContainer: HTMLDivElement;
  /** Array of item types that can be created */
  itemsConfig: ItemConfig[];
  /** Background image configuration (optional) */
  backgroundConfig?: BackgroundConfig;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Callback when viewport changes (pan/zoom) */
  onViewportChange?: (data: { scale: Vector2d; position: Vector2d }) => void;
  /** Callback when stage mode changes */
  onViewModeChange?: (mode: StageMode) => void;
  /** Callback when mouse hovers over an item */
  onItemMouseOver?: (item: PlanoramaItem) => void;
  /** Callback when mouse leaves an item */
  onItemMouseOut?: (item: PlanoramaItem) => void;
  /** Callback when an item is clicked */
  onItemMouseClick?: (item: PlanoramaItem) => void;
  /** Callback when items are selected */
  onItemsSelected?: (items: PlanoramaItem[]) => void;
  /** Callback when item creation starts */
  onCreatorStart?: (data: any) => void;
  /** Callback when item is being created (dragging) */
  onCreatorMove?: (data: any) => void;
  /** Callback when item creation ends */
  onCreatorEnd?: (data: any) => void;
  /** Callback when transformation is in progress */
  onTransformChange?: (data: any) => void;
  /** Callback when transformation ends */
  onTransformEnd?: (data: any) => void;
  /** Callback when transformation starts */
  onTransformStart?: (data: any) => void;
}

/**
 * Main Planorama API interface
 * Returned by setStage() to control the stage and items
 */
export interface Planorama {
  /** Konva Stage instance */
  stage: Stage;
  /** Set stage scale/zoom level */
  setStageScale: (scale: Vector2d) => void;
  /** Set stage position (pan) */
  setStagePosition: (position: Vector2d) => void;
  /** Center viewport on specific item by ID */
  centerStageOnObjectById: (id: string) => void;
  /** Change stage interaction mode */
  setStageMode: (mode: StageMode) => void;
  /** Align selected items horizontally */
  setXAlignment: (gap?: number) => void;
  /** Align selected items vertically */
  setYAlignment: (gap?: number) => void;
  /** Align selected items in columns and rows */
  setAlignmentInCols: (cols?: number, gap?: number) => void;
  /** Spread selected items in a circle */
  spreadItemsByCircle: (spreadOpts?: SpreadByOpts) => void;
  /** Set options for circle spread */
  setSpreadByOpts: (opts: SpreadByOpts) => void;
  /** Set current item type for creator mode */
  setCreatorCurrentItem: (config: ItemConfig) => void;
  /** Rotate selected items */
  setRotation: (rotationAngle?: number) => void;
  /** Set default rotation angle for alignment */
  setRotationAngle: (angle: number) => void;
  /** Set default gap for alignment operations */
  setGap: (gap: number) => void;
  /** Set default number of columns for alignment */
  setColumns: (cols: number) => void;
  /** Deselect all items */
  discardSelection: () => void;
  /** Delete currently selected items */
  deleteSelectedItems: () => void;
  /** Clone currently selected items */
  cloneSelectedItems: () => void;
  /** Update properties of specific item by ID */
  updateItemById: (itemId: string, updates: ItemUpdatePayload) => void;
  /** Select items by their IDs */
  selectItemsById: (ids: string[] | string) => void;
  /** Export all items on stage to array */
  exportAllItems: (callback: (items: PlanoramaItem[]) => void) => void;
  /** Import items onto stage */
  importItems: (items: PlanoramaItem[]) => void;
}
