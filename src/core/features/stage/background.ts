import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

import { BACKGROUND_LAYER_NAME, BACKGROUND_NAME } from '../../config/constants';
import { getBackgroundConfig, getDebug } from '../../state';

export const setBackground = (stage: Stage) => {
  const bgConfig = getBackgroundConfig();
  if (!bgConfig) return;

  // Check if background layer already exists
  const existingBgLayer = stage.findOne(`.${BACKGROUND_LAYER_NAME}`) as Layer;
  if (existingBgLayer) {
    existingBgLayer.destroy();
  }

  const bgLayer = new Konva.Layer({
    name: BACKGROUND_LAYER_NAME,
  });
  stage.add(bgLayer);

  Konva.Image.fromURL(bgConfig.src, function (bgImg) {
    const size = bgImg.getSize();

    // Center image on scene and add offset for positioning
    const x = stage.width() / 2 - (size.width * bgConfig.scale) / 2 + (bgConfig.offset?.x || 0);
    const y = stage.height() / 2 - (size.height * bgConfig.scale) / 2 + (bgConfig.offset?.y || 0);

    bgImg.setAttrs({
      x,
      y,
      scaleX: bgConfig.scale,
      scaleY: bgConfig.scale,
      name: BACKGROUND_NAME,
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
