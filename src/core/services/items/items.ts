import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

import { ITEM_NAME, ITEMS_LAYER_NAME, TRANSFORM_LAYER_NAME } from '../../config/config.const';
import { getCreatorCurrentItemConfig, getOnItemMouseClick, getOnItemMouseOut, getOnItemMouseOver } from '../../store/item';
import { getModeValue } from '../../store/stage';
import { getCenterOfBoundingBox, stageToWindow } from '../calc/utils';
import { setCreator } from './creator';
import { setSelector } from './selector';

const handleMouseAction = (e: any, object: any, type: 'over' | 'out', fn: (data: any) => void) => {
  const stage = e.target.getStage();
  if (stage) {
    stage.container().style.cursor = type === 'over' ? 'pointer' : 'default';
    object.fill(type === 'over' ? '#3D63EB' : '');
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
    cornerRadius: 8,
    opacity: 0.1,
    perfectDrawEnabled: false,
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
    });
    group.add(img);
  });
  group.add(item);

  if (CURRENT_ITEM.label) {
    const label = new Konva.Text({
      x: CURRENT_ITEM.width / 2,
      y: CURRENT_ITEM.height / 2,
      text: CURRENT_ITEM.label?.defaultText || String(group?._id),
      fontSize: CURRENT_ITEM.label.fontSize,
      fontFamily: CURRENT_ITEM.label.fontFamily,
      fill: CURRENT_ITEM.label.fillColor,
      listening: false,
      perfectDrawEnabled: false,
    });

    label.offsetX(label.width() / 2);
    label.offsetY(label.height() / 2);
    group.add(label);
  }

  itemsLayer.add(group);
};
