import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Text } from 'konva/lib/shapes/Text';
import { Stage } from 'konva/lib/Stage';

import { ITEM_NAME, ITEMS_LAYER_NAME, TRANSFORM_LAYER_NAME } from '../../config/config.const';
import {
    DEFAULT_HORIZONTAL_ALIGNMENT, DEFAULT_ITEM_CORNER_RADIUS, DEFAULT_ITEM_LABEL_FONT_FAMILY, DEFAULT_VERTICAL_ALIGNMENT, getCreatorCurrentItemConfig, getOnItemMouseClick,
    getOnItemMouseOut, getOnItemMouseOver, ItemBackgroundColorConfig, ItemConfig
} from '../../store/item';
import { getModeValue } from '../../store/stage';
import { getCenterOfBoundingBox, stageToWindow } from '../calc/utils';
import { setCreator } from './creator';
import { setSelector } from './selector';

const handleMouseAction = (e: any, object: any, type: 'over' | 'out', fn: (data: any) => void) => {
  console.log(type);

  const stage = e.target.getStage();
  if (stage) {
    stage.container().style.cursor = type === 'over' ? 'pointer' : 'default';
    object.fill(type === 'over' ? 'rgba(0,0,0, 0.1)' : 'transparent');

    const parent = object.getParent();
    fn({
      type: parent?.attrs.type,
      boundingBox: parent?.getClientRect({ relativeTo: stage }),
      id: parent?.attrs.id,
      pos: parent?.getRelativePointerPosition(),
      itemCenter: stageToWindow(stage, getCenterOfBoundingBox(parent?.getClientRect({ relativeTo: stage }))),
      scale: stage.attrs.scaleX,
      e,
    });
  }
};

const handleMouseClickAction = (e: any, object: any, fn: (data: any) => void) => {
  const stage = e.target.getStage();
  if (stage) {
    const parent = object.getParent();
    console.log(parent);

    fn({
      type: parent?.attrs.type,
      boundingBox: parent?.getClientRect({ relativeTo: stage }),
      id: parent?.attrs.id,
      pos: parent?.getRelativePointerPosition(),
      itemCenter: stageToWindow(stage, getCenterOfBoundingBox(parent?.getClientRect({ relativeTo: stage }))),
      itemCenterOnStage: getCenterOfBoundingBox(parent?.getClientRect({ relativeTo: stage })),
      scale: stage.attrs.scaleX,
      e,
    });
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
};

export const createItem = (x: number, y: number, rotation: number, stage: Stage) => {
  const itemsLayer = stage.findOne(`.${ITEMS_LAYER_NAME}`) as Layer;
  const CURRENT_ITEM = getCreatorCurrentItemConfig();

  if (!CURRENT_ITEM) return;

  const group = new Konva.Group({
    x,
    y,
    rotation,
    draggable: false,
    name: ITEM_NAME,
    perfectDrawEnabled: false,
    type: CURRENT_ITEM.name,
    id: `item-` + crypto.randomUUID(),
  });

  const item = new Konva.Rect({
    x: 0,
    y: 0,
    width: CURRENT_ITEM.width,
    height: CURRENT_ITEM.height,
    cornerRadius: DEFAULT_ITEM_CORNER_RADIUS,
    opacity: 1,
    fill: 'rgba(0,0,0,0)',
    perfectDrawEnabled: false,
    zIndex: 5,
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

  Konva.Image.fromURL(CURRENT_ITEM.src, function (img) {
    img.setAttrs({
      x: 0,
      y: 0,
      listening: false,
      perfectDrawEnabled: false,
      scale: CURRENT_ITEM.scale,
      zIndex: 3,
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
    x: calculateLabelXPosition(config),
    y: calculateLabelYPosition(config),
    text: config.label?.defaultText || groupId,
    fontSize: config.label.fontSize,
    fontFamily: config.label.fontFamily || DEFAULT_ITEM_LABEL_FONT_FAMILY,
    fill: config.label.fillColor,
    listening: false,
    perfectDrawEnabled: false,
    zIndex: 4,
  });

  label.offsetX(label.width() / 2);
  label.offsetY(label.height() / 2);

  return label;
}

function calculateLabelYPosition(itemConfig: ItemConfig): number {
  const verticalAlignment = itemConfig.label?.verticalAlignment ?? DEFAULT_VERTICAL_ALIGNMENT;
  return (itemConfig.height * verticalAlignment) / 100;
}

function calculateLabelXPosition(itemConfig: ItemConfig): number {
  const horizontalAlignment = itemConfig.label?.horizontalAlignment ?? DEFAULT_HORIZONTAL_ALIGNMENT;
  return (itemConfig.width * horizontalAlignment) / 100;
}

function createBackgroundRect(width: number, height: number, background: ItemBackgroundColorConfig): Konva.Rect {
  return new Konva.Rect({
    x: 0,
    y: 0,
    width,
    height,
    fill: background.backgroundColor,
    stroke: background.strokeColor,
    strokeWidth: background.strokeWidth,
    perfectDrawEnabled: false,
    cornerRadius: DEFAULT_ITEM_CORNER_RADIUS,
    zIndex: 1,
  });
}
