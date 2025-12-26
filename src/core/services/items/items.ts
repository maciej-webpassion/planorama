import Konva from 'konva';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Image } from 'konva/lib/shapes/Image';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import { Stage } from 'konva/lib/Stage';

import { ITEM_ACTIONS_RECT_NAME, ITEM_BACKGROUND_NAME, ITEM_LABEL_NAME, ITEM_NAME, ITEMS_LAYER_NAME, TRANSFORM_LAYER_NAME } from '../../config/constants';
import { getDebug } from '../../store/debug';
import { on } from '../../store/event-bus';
import {
    DEFAULT_HORIZONTAL_ALIGNMENT, DEFAULT_ITEM_CORNER_RADIUS, DEFAULT_ITEM_LABEL_FONT_FAMILY, DEFAULT_VERTICAL_ALIGNMENT, getCreatorItems, getOnItemMouseClick, getOnItemMouseOut,
    getOnItemMouseOver, ItemBackgroundColorConfig, ItemConfig, ItemLabelConfig, ItemUpdatePayload, PlanoramaItem
} from '../../store/item';
import { getModeValue } from '../../store/stage';
import { exportAllItems, extractItemData } from '../calc/utils/items';
import { setCreator } from './creator';
import { setSelector } from './selector';

type MouseEventCallbackFn = (data: PlanoramaItem) => void;
type MouseOverActionType = 'over' | 'out';

const handleMouseAction = (e: any, object: Rect, type: MouseOverActionType, fn: MouseEventCallbackFn) => {
  const stage = e.target.getStage();
  if (stage) {
    stage.container().style.cursor = type === 'over' ? 'pointer' : 'default';
    object.fill(type === 'over' ? 'rgba(0,0,0, 0.1)' : 'transparent');
    fn(extractItemData(object));
  }
};

const handleMouseClickAction = (e: any, object: Rect, fn: MouseEventCallbackFn) => {
  const stage = e.target.getStage();
  if (stage) {
    fn(extractItemData(object));
  }
};

export const setItemsLayer = (stage: Stage) => {
  const itemsLayer = new Konva.Layer({
    name: ITEMS_LAYER_NAME,
  });
  const transformLayer = new Konva.Layer({
    name: TRANSFORM_LAYER_NAME,
  });
  stage.add(itemsLayer);
  stage.add(transformLayer);
  setCreator(itemsLayer, stage);
  setSelector(transformLayer, itemsLayer, stage);

  // EVENTS
  on('item:action:updateById', (payload: ItemUpdatePayload) => {
    if (!payload.id) return;
    updateItemById(payload.id, payload, stage);
  });

  on('item:action:exportAll', (callback: (items: PlanoramaItem[]) => void) => {
    const items = exportAllItems(stage);
    callback(items);
  });

  on('item:action:importAll', (items: PlanoramaItem[]) => {
    importItems(items, stage);
  });
};

export const createItem = (
  x: number,
  y: number,
  rotation: number,
  itemConfig: ItemConfig,
  stage: Stage,
  id = ''
): string | undefined => {
  const itemsLayer = stage.findOne(`.${ITEMS_LAYER_NAME}`) as Layer;
  const CURRENT_ITEM = itemConfig;

  if (!CURRENT_ITEM) return;

  const itemId = id || `item-` + crypto.randomUUID();

  const group = new Group({
    x,
    y,
    rotation,
    draggable: false,
    name: ITEM_NAME,
    perfectDrawEnabled: false,
    type: CURRENT_ITEM.name,
    id: itemId,
  });

  const item = new Rect({
    x: 0,
    y: 0,
    width: CURRENT_ITEM.width,
    height: CURRENT_ITEM.height,
    cornerRadius: DEFAULT_ITEM_CORNER_RADIUS,
    opacity: 1,
    fill: 'rgba(0,0,0,0)',
    perfectDrawEnabled: false,
    name: ITEM_ACTIONS_RECT_NAME,
  });

  item.on('mouseover', function (e) {
    handleMouseAction(e, this, 'over', getOnItemMouseOver());
  });

  item.on('mouseout', function (e) {
    handleMouseAction(e, this, 'out', getOnItemMouseOut());
  });

  item.on('click tap', function (e) {
    if (getModeValue() !== 'viewport') return;
    handleMouseClickAction(e, this, getOnItemMouseClick());
  });

  Image.fromURL(CURRENT_ITEM.src, function (img) {
    img.setAttrs({
      x: 0,
      y: 0,
      listening: false,
      perfectDrawEnabled: false,
      scale: CURRENT_ITEM.scale,
    });

    if (CURRENT_ITEM.background) {
      const background = createBackgroundRect(CURRENT_ITEM.width, CURRENT_ITEM.height, CURRENT_ITEM.background);
      group.add(background);
    }

    group.add(img);

    if (CURRENT_ITEM.label) {
      const label = createLabel(CURRENT_ITEM, String(group?._id || ''));
      group.add(label);
    }

    group.add(item);
  });

  itemsLayer.add(group);
  return itemId;
};

function createLabel(config: ItemConfig, groupId: string): Text {
  if (!config.label) {
    throw new Error('Label config is missing');
  }

  const label = new Konva.Text({
    x: calculateLabelXPosition(config.label.horizontalAlignment, config.width),
    y: calculateLabelYPosition(config.label.verticalAlignment, config.height),
    text: config.label?.defaultText || groupId,
    fontSize: config.label.fontSize,
    fontFamily: config.label.fontFamily || DEFAULT_ITEM_LABEL_FONT_FAMILY,
    fill: config.label.fillColor,
    listening: false,
    perfectDrawEnabled: false,
    name: ITEM_LABEL_NAME,
  });

  label.offsetX(label.width() / 2);
  label.offsetY(label.height() / 2);

  return label;
}

function calculateLabelYPosition(verticalAlignment: number | undefined, height: number): number {
  const v = verticalAlignment || DEFAULT_VERTICAL_ALIGNMENT;
  return (height * v) / 100;
}

function calculateLabelXPosition(horizontalAlignment: number | undefined, width: number): number {
  const h = horizontalAlignment || DEFAULT_HORIZONTAL_ALIGNMENT;
  return (width * h) / 100;
}

function createBackgroundRect(width: number, height: number, background: ItemBackgroundColorConfig): Rect {
  return new Rect({
    x: 0,
    y: 0,
    width,
    height,
    fill: background.backgroundColor,
    stroke: background.strokeColor,
    strokeWidth: background.strokeWidth,
    perfectDrawEnabled: false,
    cornerRadius: DEFAULT_ITEM_CORNER_RADIUS,
    name: ITEM_BACKGROUND_NAME,
  });
}

/**
 * Update an existing item by ID
 * @param itemId Item ID to update
 * @param updates Object containing properties to update
 * @param stage Stage instance
 */
export function updateItemById(itemId: string, updates: ItemUpdatePayload, stage: Stage): void {
  const item = stage.findOne(`#${itemId}`) as Group;

  if (!item) {
    if (getDebug()) console.warn(`Item with id "${itemId}" not found`);
    return;
  }

  const itemRect = item.findOne(`.${ITEM_ACTIONS_RECT_NAME}`) as Rect | undefined;
  const width = itemRect?.width() || 0;
  const height = itemRect?.height() || 0;

  if (getDebug()) console.log(item);

  // Update background
  if (updates.background) {
    const backgroundRect = item.findOne(`.${ITEM_BACKGROUND_NAME}`) as Rect;

    if (backgroundRect) {
      if (updates.background.backgroundColor !== undefined) {
        backgroundRect.fill(updates.background.backgroundColor);
      }
      if (updates.background.strokeColor !== undefined) {
        backgroundRect.stroke(updates.background.strokeColor);
      }
      if (updates.background.strokeWidth !== undefined) {
        backgroundRect.strokeWidth(updates.background.strokeWidth);
      }
    }
  }

  // Update label
  if (updates.label) {
    const labelText = item.findOne(`.${ITEM_LABEL_NAME}`) as Text;

    if (labelText) {
      if (updates.label.text !== undefined) {
        labelText.text(updates.label.text);
      }
      if (updates.label.fontSize !== undefined) {
        labelText.fontSize(updates.label.fontSize);
      }
      if (updates.label.fontFamily !== undefined) {
        labelText.fontFamily(updates.label.fontFamily);
      }
      if (updates.label.fillColor !== undefined) {
        labelText.fill(updates.label.fillColor);
      }

      // Update label position if alignment changes
      if (updates.label.horizontalAlignment !== undefined || updates.label.verticalAlignment !== undefined) {
        const newX = calculateLabelXPosition(updates.label.horizontalAlignment, width);
        const newY = calculateLabelYPosition(updates.label.verticalAlignment, height);

        labelText.x(newX);
        labelText.y(newY);
        labelText.offsetX(labelText.width() / 2);
        labelText.offsetY(labelText.height() / 2);
      }
    }
  }

  // Redraw the layer
  item.getLayer()?.batchDraw();
}

/**
 * Import items into the stage
 * @param items Array of PlanoramaItem objects to import
 * @param stage Stage instance
 */
export function importItems(items: PlanoramaItem[], stage: Stage): void {
  const itemsLayer = stage.findOne(`.${ITEMS_LAYER_NAME}`) as Layer;
  const itemsConfig = getCreatorItems();

  if (!itemsLayer) {
    if (getDebug()) console.warn('Items layer not found');
    return;
  }

  items.forEach((item) => {
    // Check if item already exists by ID
    const existingItem = stage.findOne(`#${item.id}`) as Group | undefined;

    if (existingItem) {
      // Item exists, update it with itemProps
      if (getDebug()) console.log(`Item ${item.id} already exists, updating...`);
      updateItemById(item.id, item.itemProps, stage);
    } else {
      const itemConfig = itemsConfig.find((config) => config.name === item.type);

      if (!itemConfig) {
        if (getDebug()) console.warn(`Item config for type "${item.type}" not found, skipping item ${item.id}`);
        return;
      }

      // Merge itemConfig with item.itemProps to create complete configuration
      const mergedConfig: ItemConfig = {
        ...itemConfig,
        label: item.itemProps?.label
          ? ({
              ...itemConfig.label,
              ...item.itemProps.label,
            } as ItemLabelConfig)
          : itemConfig.label,
        background: item.itemProps?.background
          ? ({
              ...itemConfig.background,
              ...item.itemProps.background,
            } as ItemBackgroundColorConfig)
          : itemConfig.background,
      };

      // Item doesn't exist, create it with merged configuration
      if (getDebug()) console.log(`Creating new item ${item.id}...`);
      createItem(item.transform.x, item.transform.y, item.transform.rotation, mergedConfig, stage, item.id);
    }
  });

  // Redraw the layer
  itemsLayer.batchDraw();
}
