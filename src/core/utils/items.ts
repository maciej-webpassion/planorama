import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Rect } from 'konva/lib/shapes/Rect';
import { Text } from 'konva/lib/shapes/Text';
import { Stage } from 'konva/lib/Stage';

import { ITEM_ACTIONS_RECT_NAME, ITEM_BACKGROUND_NAME, ITEM_LABEL_NAME, ITEM_NAME, ITEMS_LAYER_NAME } from '../config/constants';
import { DEFAULT_HORIZONTAL_ALIGNMENT, DEFAULT_VERTICAL_ALIGNMENT, getDebug, ItemUpdatePayload, PlanoramaItem } from '../state';
import { getCenterOfBoundingBox } from './transform';
import { stageToWindow } from './window';

/**
 * Export all items from the stage
 * @param stage Stage instance
 * @returns Array of PlanoramaItem objects
 */
export const exportAllItems = (stage: Stage): PlanoramaItem[] => {
  const itemsLayer = stage.findOne(`.${ITEMS_LAYER_NAME}`) as Layer;

  if (!itemsLayer) {
    if (getDebug()) console.warn('Items layer not found');
    return [];
  }

  // Find all groups with ITEM_NAME
  const itemGroups = itemsLayer.find(`.${ITEM_NAME}`) as Group[];

  const items: PlanoramaItem[] = [];

  itemGroups.forEach((group) => {
    // Find the actions rect within each group
    const actionsRect = group.findOne(`.${ITEM_ACTIONS_RECT_NAME}`) as Rect | undefined;

    if (actionsRect) {
      try {
        const itemData = extractItemData(actionsRect);
        items.push(itemData);
      } catch (error) {
        if (getDebug()) console.warn(`Failed to extract data for item ${group.attrs.id}:`, error);
      }
    }
  });

  return items;
};

export const extractItemData = (item: Rect): PlanoramaItem => {
  const stage = item.getStage();
  if (!stage) {
    throw new Error('Stage not found for the item');
  }

  const parent = item.getParent() as Group;
  return extractItem(parent);
};

export const extractItem = (item: Group): PlanoramaItem => {
  const stage = item.getStage();
  if (!stage) {
    throw new Error('Stage not found for the item');
  }

  return {
    id: item?.attrs.id,
    type: item?.attrs.type,
    boundingBox: item?.getClientRect({ relativeTo: stage }),
    pos: item?.getRelativePointerPosition()!,
    itemCenter: stageToWindow(stage, getCenterOfBoundingBox(item?.getClientRect({ relativeTo: stage }))),
    scale: stage.attrs.scaleX,
    transform: item?.getTransform().decompose(),
    itemProps: extractItemProps(item),
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
