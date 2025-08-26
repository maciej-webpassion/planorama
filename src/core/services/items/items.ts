import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

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
  const group = new Konva.Group({
    x,
    y,
    rotation,
    draggable: false,
    name: "parkey-item",
  });

  const item = new Konva.Rect({
    x: 0,
    y: 0,
    width: 90,
    height: 180,
    cornerRadius: 8,
    stroke: "#7592b6",
    strokeWidth: 1,
    opacity: 0.5,
  });

  item.on("mouseover", function () {
    this.strokeWidth(2);
  });
  item.on("mouseout", function () {
    this.strokeWidth(1);
  });

  Konva.Image.fromURL("assets/spot.svg", function (img) {
    img.setAttrs({
      x: 9,
      y: 15,
      scaleX: 0.25,
      scaleY: 0.25,
      listening: false,
    });
    group.add(img);
  });

  group.add(item);

  ITEMS_LAYER.add(group);
};
