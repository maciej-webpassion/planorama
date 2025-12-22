import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

import { BACKGROUND_LAYER_NAME } from '../config/config.const';
import { getDebug } from '../store/debug';

const BG_SCALE = 1.9;

export const setBackground = (stage: Stage) => {
  const bgLayer = new Konva.Layer();
  stage.add(bgLayer);

  Konva.Image.fromURL('assets/bg-test.svg', function (bgImg) {
    const size = bgImg.getSize();

    //center image on scene
    const x = stage.width() / 2 - (size.width * BG_SCALE) / 2;
    const y = stage.height() / 2 - (size.height * BG_SCALE) / 2;

    bgImg.setAttrs({
      x,
      y,
      scaleX: BG_SCALE,
      scaleY: BG_SCALE,
      name: BACKGROUND_LAYER_NAME,
    });
    bgLayer.add(bgImg);
  });

  addDebugIndicators(bgLayer, stage);

  bgLayer.moveToBottom();
};

function addDebugIndicators(bgLayer: Layer, stage: Stage) {
  if (!getDebug()) return;
  const lineH = new Konva.Line({
    points: [0, stage.height() / 2, stage.width(), stage.height() / 2],
    stroke: 'red',
    strokeWidth: 1,
    dash: [4, 4],
  });

  const lineV = new Konva.Line({
    points: [stage.width() / 2, 0, stage.width() / 2, stage.height()],
    stroke: 'red',
    strokeWidth: 1,
    dash: [4, 4],
  });

  bgLayer.add(lineH);
  bgLayer.add(lineV);
}
