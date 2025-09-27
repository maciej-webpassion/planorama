import './style.css';

import { setStage, Vector2d } from './core/services/stage.ts';
import { RotationMode } from './core/store/select/index.ts';

const stageContainer = document.querySelector<HTMLDivElement>('#parkey-plan-stage')!;
function onViewportChange(data: { scale: Vector2d; position: Vector2d }) {
  // console.log(data);
}

const { setStageMode, setXAlignment, setYAlignment, spreadItemsByCircle, setSpreadOpts } = setStage({
  stageContainer,
  onViewportChange,
});

const modeSelector = document.querySelector<HTMLSelectElement>('#select-mode')!;
const alignXButton = document.querySelector<HTMLButtonElement>('#btn-align-x')!;
const alignYButton = document.querySelector<HTMLButtonElement>('#btn-align-y')!;
const spreadByCircleButton = document.querySelector<HTMLButtonElement>('#btn-spread-circle')!;

const rotationMode = document.querySelector<HTMLSelectElement>('#select-rotation')!;
const rotationRadius = document.querySelector<HTMLInputElement>('#input-radius')!;

rotationMode.addEventListener('change', () => {
  let value = rotationMode.value as any;
  if (value === 'none') {
    value = null;
  }

  const rotationValue = rotationRadius.value ? parseInt(rotationRadius.value, 10) : 500;
  setSpreadOpts({ withRotation: value as RotationMode, radius: rotationValue });
});

modeSelector.addEventListener('change', () => {
  setStageMode(modeSelector.value as any);
});

alignXButton.addEventListener('click', () => {
  setXAlignment();
});

alignYButton.addEventListener('click', () => {
  setYAlignment();
});

spreadByCircleButton.addEventListener('click', () => {
  spreadItemsByCircle();
});

setTimeout(() => {
  // setStageScale({ x: 0.5, y: 0.5 });
}, 2000);
