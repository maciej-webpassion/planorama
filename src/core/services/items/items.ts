import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

import { ITEM_NAME, ITEMS_LAYER_NAME, TRANSFORM_LAYER_NAME } from '../../config/config.const';
import { getCreatorCurrentItemConfig, getOnItemMouseOut, getOnItemMouseOver } from '../../store/item';
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
      internalId: parent?._id,
      pos: parent?.getRelativePointerPosition(),
      itemCenter: stageToWindow(stage, getCenterOfBoundingBox(parent?.getClientRect({ relativeTo: stage }))),
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
  const onItemMouseOver = getOnItemMouseOver();
  const onItemMouseOut = getOnItemMouseOut();
  if (!CURRENT_ITEM) return;

  const group = new Konva.Group({
    x,
    y,
    rotation,
    draggable: false,
    name: ITEM_NAME,
    perfectDrawEnabled: false,
    type: CURRENT_ITEM.name,
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
    handleMouseAction(e, this, 'over', onItemMouseOver);
  });
  item.on('mouseout', function (e) {
    handleMouseAction(e, this, 'out', onItemMouseOut);
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

  itemsLayer.add(group);
};
