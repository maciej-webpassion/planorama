import './style.css';

import { setStage, Vector2d } from './core/services/stage.ts';
import { ItemConfig } from './core/store/item/index.ts';
import { RotationMode } from './core/store/select/index.ts';

const stageContainer = document.querySelector<HTMLDivElement>('#parkey-plan-stage')!;
function onViewportChange(data: { scale: Vector2d; position: Vector2d }) {
  // console.log(data);
}

export const TMP_GROUPS: ItemConfig[] = [
  {
    name: 'parking-spot',
    width: 90,
    height: 180,
    src: 'assets/spot-1.svg',
    scale: { x: 1.875, y: 1.875 },
  },
  {
    name: 'computer-item',
    width: 80,
    height: 80,
    src: 'assets/computer.svg',
    scale: { x: 0.1, y: 0.1 },
  },
];

function onViewModeChange(mode: string) {
  console.log('View mode changed to:', mode);
  MODE = mode;
}

let MODE = 'viewport';

const { setStageMode, setXAlignment, setYAlignment, spreadItemsByCircle, setSpreadOpts, setCreatorCurrentItem } =
  setStage({
    stageContainer,
    onViewportChange,
    onViewModeChange,
  });

const modeSelector = document.querySelector<HTMLSelectElement>('#select-mode')!;
const alignXButton = document.querySelector<HTMLButtonElement>('#btn-align-x')!;
const alignYButton = document.querySelector<HTMLButtonElement>('#btn-align-y')!;
const spreadByCircleButton = document.querySelector<HTMLButtonElement>('#btn-spread-circle')!;

const rotationMode = document.querySelector<HTMLSelectElement>('#select-rotation')!;
const rotationRadius = document.querySelector<HTMLInputElement>('#input-radius')!;

const computerItemButton = document.querySelector<HTMLButtonElement>('#btn-creator-computer')!;
const parkingItemButton = document.querySelector<HTMLButtonElement>('#btn-creator-parking')!;

rotationMode.addEventListener('change', () => {
  let value = rotationMode.value as any;
  if (value === 'none') {
    value = null;
  }

  const rotationValue = rotationRadius.value ? parseInt(rotationRadius.value, 10) : 500;
  setSpreadOpts({ withRotation: value as RotationMode, radius: rotationValue });
});

rotationRadius.addEventListener('change', () => {
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

computerItemButton.addEventListener('click', () => {
  setCreatorCurrentItem(TMP_GROUPS[1]);
});

parkingItemButton.addEventListener('click', () => {
  setCreatorCurrentItem(TMP_GROUPS[0]);
});

setTimeout(() => {
  // setStageScale({ x: 0.5, y: 0.5 });
}, 2000);
