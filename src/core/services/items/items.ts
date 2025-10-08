import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

import { ITEM_NAME } from '../../config/config.const';
import { getCreatorCurrentItemConfig, getOnItemMouseOver } from '../../store/item';
import { setCreator } from './creator';
import { setSelector } from './selector';

let ITEMS_LAYER: Layer;
let TRANSFORM_LAYER: Layer;

export const setItemsLayer = (stage: Stage) => {
  ITEMS_LAYER = new Konva.Layer();
  TRANSFORM_LAYER = new Konva.Layer();
  stage.add(ITEMS_LAYER);
  stage.add(TRANSFORM_LAYER);
  setCreator(ITEMS_LAYER, stage);
  setSelector(TRANSFORM_LAYER, ITEMS_LAYER, stage);
};

export const createItem = (x: number, y: number, rotation: number) => {
  const CURRENT_ITEM = getCreatorCurrentItemConfig();
  const onItemMouseOver = getOnItemMouseOver();
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
    this.fill('#3D63EB');
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = 'pointer';
      const parent = this.getParent();
      onItemMouseOver({
        type: parent?.attrs.type,
        boundingBox: parent?.getClientRect({ relativeTo: stage }),
        internalId: parent?._id,
        pos: parent?.getRelativePointerPosition(),
        scale: stage.attrs.scaleX,
        e,
      });
    }
  });
  item.on('mouseout', function (e) {
    this.fill('');
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = 'default';
    }
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

  ITEMS_LAYER.add(group);
};
