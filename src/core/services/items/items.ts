import Konva from 'konva';
import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Image } from 'konva/lib/shapes/Image';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import { Stage } from 'konva/lib/Stage';

import {
  ITEM_ACTIONS_RECT_NAME,
  ITEM_BACKGROUND_NAME,
  ITEM_LABEL_NAME,
  ITEM_NAME,
  ITEMS_LAYER_NAME,
  TRANSFORM_LAYER_NAME,
} from '../../config/config.const';
import { on } from '../../store/event-bus';
import {
  DEFAULT_HORIZONTAL_ALIGNMENT,
  DEFAULT_ITEM_CORNER_RADIUS,
  DEFAULT_ITEM_LABEL_FONT_FAMILY,
  DEFAULT_VERTICAL_ALIGNMENT,
  getCreatorCurrentItemConfig,
  getOnItemMouseClick,
  getOnItemMouseOut,
  getOnItemMouseOver,
  ItemBackgroundColorConfig,
  ItemConfig,
  ItemUpdatePayload,
  PlanoramaItem,
} from '../../store/item';
import { getModeValue } from '../../store/stage';
import { getCenterOfBoundingBox, stageToWindow } from '../calc/utils';
import { setCreator } from './creator';
import { setSelector } from './selector';

type MouseEventCallbackFn = (data: PlanoramaItem) => void;

const extractItemData = (item: Rect): PlanoramaItem => {
  const stage = item.getStage();
  if (!stage) {
    throw new Error('Stage not found for the item');
  }

  const parent = item.getParent() as Group;

  return {
    id: parent?.attrs.id,
    type: parent?.attrs.type,
    boundingBox: parent?.getClientRect({ relativeTo: stage }),
    pos: parent?.getRelativePointerPosition()!,
    itemCenter: stageToWindow(stage, getCenterOfBoundingBox(parent?.getClientRect({ relativeTo: stage }))),
    scale: stage.attrs.scaleX,
    transform: parent?.getTransform().decompose(),
    itemProps: extractItemProps(parent),
  };
};

/**
 * Extract item properties from a Konva Group
 * @param parent The parent Group containing the item
 * @returns ItemUpdatePayload with current item properties
 */
const extractItemProps = (parent: Group): Omit<ItemUpdatePayload, 'id'> => {
  const backgroundRect = parent.findOne(`.${ITEM_BACKGROUND_NAME}`) as Rect | undefined;

  const labelText = parent.findOne(`.${ITEM_LABEL_NAME}`) as Text | undefined;

  const itemRect = parent.findOne(`.${ITEM_ACTIONS_RECT_NAME}`) as Rect | undefined;
  const width = itemRect?.width() || 0;
  const height = itemRect?.height() || 0;

  const props: Omit<ItemUpdatePayload, 'id'> = {};

  // Extract background properties
  if (backgroundRect) {
    props.background = {
      backgroundColor: String(backgroundRect.fill()),
      strokeColor: String(backgroundRect.stroke()),
      strokeWidth: backgroundRect.strokeWidth(),
    };
  }

  // Extract label properties
  if (labelText) {
    // Calculate alignment percentages
    const horizontalAlignment = width > 0 ? (labelText.x() / width) * 100 : DEFAULT_HORIZONTAL_ALIGNMENT;
    const verticalAlignment = height > 0 ? (labelText.y() / height) * 100 : DEFAULT_VERTICAL_ALIGNMENT;

    props.label = {
      text: labelText.text(),
      fontSize: labelText.fontSize(),
      fontFamily: labelText.fontFamily(),
      fillColor: String(labelText.fill()),
      verticalAlignment,
      horizontalAlignment,
    };
  }

  return props;
};

const handleMouseAction = (e: any, object: Rect, type: 'over' | 'out', fn: MouseEventCallbackFn) => {
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
};

export const createItem = (x: number, y: number, rotation: number, stage: Stage) => {
  const itemsLayer = stage.findOne(`.${ITEMS_LAYER_NAME}`) as Layer;
  const CURRENT_ITEM = getCreatorCurrentItemConfig();

  if (!CURRENT_ITEM) return;

  const group = new Group({
    x,
    y,
    rotation,
    draggable: false,
    name: ITEM_NAME,
    perfectDrawEnabled: false,
    type: CURRENT_ITEM.name,
    id: `item-` + crypto.randomUUID(),
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
  console.log(v);
  console.log(height);

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
    console.warn(`Item with id "${itemId}" not found`);
    return;
  }

  const itemRect = item.findOne(`.${ITEM_ACTIONS_RECT_NAME}`) as Rect | undefined;
  const width = itemRect?.width() || 0;
  const height = itemRect?.height() || 0;

  console.log(item);

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

        console.log(width);
        console.log(height);
        console.log(newX);
        console.log(newY);

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
