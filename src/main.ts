import './style.css';

import { setStage, Vector2d } from './core/services/stage.ts';
import { ItemConfig } from './core/store/item/index.ts';
import { RotationMode } from './core/store/select/index.ts';

const stageContainer = document.querySelector<HTMLDivElement>('#planorama-stage')!;
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
    label: {
      fontSize: 20,
      fontFamily: 'Helvetica',
      fillColor: '#666',
    },
  },
  {
    name: 'computer-item',
    width: 80,
    height: 80,
    src: 'assets/computer.svg',
    scale: { x: 0.1, y: 0.1 },
    label: {
      defaultText: 'PC',
      fontSize: 16,
      fontFamily: 'Helvetica',
      fillColor: '#003306',
    },
  },
];

function onViewModeChange(mode: string) {
  console.log('View mode changed to:', mode);
  MODE = mode;
}

function onItemMouseOver(item: any) {
  console.log('Item mouse over:', item);
  tooltip.classList.add('visible');
  if (item.itemCenter) {
    tooltip.style.left = item.itemCenter.x + 'px';
    tooltip.style.top = item.itemCenter.y + 'px';
    tooltip.innerText = `Id: ${item.internalId} Item: ${item.type}`;
  }
}

function onItemMouseOut(item: any) {
  console.log('Item mouse out:', item);
  tooltip.classList.remove('visible');
}

function onItemMouseClick(item: any) {
  console.log('Item mouse click:', item);
  const dialogText = dialog.querySelector<HTMLParagraphElement>('.dialog-text')!;
  dialogText.innerText = `You clicked on item Id: ${item.internalId} Type: ${item.type}`;
  dialog.showModal();
}

let MODE = 'viewport';

const {
  setStageMode,
  setXAlignment,
  setYAlignment,
  spreadItemsByCircle,
  setSpreadOpts,
  setCreatorCurrentItem,
  setGap,
  setRotation,
  setRotationAngle,
  discardSelection,
  deleteSelectedItems,
} = setStage({
  stageContainer,
  onViewportChange,
  onViewModeChange,
  onItemMouseOver,
  onItemMouseOut,
  onItemMouseClick,
});

const modeSelector = document.querySelector<HTMLSelectElement>('#select-mode')!;
const alignXButton = document.querySelector<HTMLButtonElement>('#btn-align-x')!;
const alignYButton = document.querySelector<HTMLButtonElement>('#btn-align-y')!;

const rotateButton = document.querySelector<HTMLButtonElement>('#btn-rotate')!;
const angleInput = document.querySelector<HTMLInputElement>('#input-rotate')!;

const spreadByCircleButton = document.querySelector<HTMLButtonElement>('#btn-spread-circle')!;

const rotationMode = document.querySelector<HTMLSelectElement>('#select-rotation')!;
const rotationRadius = document.querySelector<HTMLInputElement>('#input-radius')!;

const computerItemButton = document.querySelector<HTMLButtonElement>('#btn-creator-computer')!;
const parkingItemButton = document.querySelector<HTMLButtonElement>('#btn-creator-parking')!;

const gapInput = document.querySelector<HTMLInputElement>('#input-gap')!;
const tooltip = document.querySelector<HTMLDivElement>('#tooltip')!;

const dialog = document.querySelector<HTMLDialogElement>('#item-dialog')!;

gapInput.addEventListener('change', () => {
  const gap = gapInput.value ? parseInt(gapInput.value, 10) : 10;
  console.log('Setting gap to:', gap);
  setGap(gap);
});

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

rotateButton.addEventListener('click', () => {
  setRotation();
});

angleInput.addEventListener('change', () => {
  const angle = angleInput.value ? parseInt(angleInput.value, 10) : 0;
  setRotationAngle(angle);
});

spreadByCircleButton.addEventListener('click', () => {
  spreadItemsByCircle();
});

computerItemButton.addEventListener('click', () => {
  setStageMode('create');
  modeSelector.value = 'create';
  setCreatorCurrentItem(TMP_GROUPS[1]);
});

parkingItemButton.addEventListener('click', () => {
  setStageMode('create');
  modeSelector.value = 'create';
  setCreatorCurrentItem(TMP_GROUPS[0]);
});

stageContainer.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    discardSelection();
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    deleteSelectedItems();
  }
  e.preventDefault();
});

stageContainer.tabIndex = 1;

setTimeout(() => {
  // setStageScale({ x: 0.5, y: 0.5 });
}, 2000);
