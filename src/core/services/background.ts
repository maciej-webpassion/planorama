import Konva from 'konva';
import { Stage } from 'konva/lib/Stage';

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
      name: 'background',
    });
    bgLayer.add(bgImg);
  });

  // center indicator
  const circle = new Konva.Circle({
    radius: 10,
    fill: 'red',
    x: stage.width() / 2,
    y: stage.height() / 2,
  });

  const circle1 = new Konva.Circle({
    radius: 10,
    fill: 'blue',
    x: 0,
    y: 0,
  });

  const rect1 = new Konva.Rect({
    width: 200,
    height: 200,
    fill: 'blue',
    x: 0,
    y: 0,
    rotation: 95,
  });

  bgLayer.add(circle);
  bgLayer.add(circle1);
  bgLayer.add(rect1);
  bgLayer.moveToBottom();
};
