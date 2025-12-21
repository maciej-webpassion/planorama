import './style.css';

import { getTranslateForRotation } from './calc.ts';
import { setStage, Vector2d } from './core/services/stage.ts';
import { ItemConfig } from './core/store/item/index.ts';
import { RotationMode } from './core/store/select/index.ts';

const stageContainer = document.querySelector<HTMLDivElement>('#planorama-stage')!;
function onViewportChange(data: { scale: Vector2d; position: Vector2d }) {
  console.log(data);
}
const tooltip = document.querySelector<HTMLDivElement>('#tooltip')!;

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
    background: {
      backgroundColor: 'rgba(196, 183, 203, 0.5)',
      strokeColor: 'rgba(196, 183, 203, 0.8)',
      strokeWidth: 1.5,
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

// var MODE = 'viewport';

function onViewModeChange(mode: string) {
  console.log('View mode changed to:', mode);
  // MODE = mode;
}

function onItemMouseOver(item: any) {
  console.log('Item mouse over:', item);
  tooltip.classList.add('visible');
  if (item.itemCenter) {
    tooltip.style.left = item.itemCenter.x + 'px';
    tooltip.style.top = item.itemCenter.y + 'px';
    tooltip.innerText = `Id: ${item.id} Item: ${item.type}`;
  }
}

function onItemMouseOut(item: any) {
  console.log('Item mouse out:', item);
  tooltip.classList.remove('visible');
}
function onItemMouseClick(item: any) {
  console.log('Item mouse click:', item);
  const dialogText = dialog.querySelector<HTMLParagraphElement>('.dialog-text')!;
  dialogText.innerText = `You clicked on item Id: ${item.id} Type: ${item.type}`;
  dialog.setAttribute('data-item-id', item.id);

  // Get item config defaults
  // const itemConfig = TMP_GROUPS.find((g) => g.name === item.type);

  // Create ItemUpdatePayload with defaults from config
  const itemProps = item.itemProps;

  // Populate form inputs from itemProps
  inputBgColor.value = itemProps.background?.backgroundColor ?? '';
  inputStrokeColor.value = itemProps.background?.strokeColor ?? '';
  inputStrokeWidth.value = itemProps.background?.strokeWidth != null ? String(itemProps.background.strokeWidth) : '';

  inputLabelText.value = itemProps.label?.text ?? '';
  inputLabelFontSize.value = itemProps.label?.fontSize != null ? String(itemProps.label.fontSize) : '';
  inputLabelFontFamily.value = itemProps.label?.fontFamily ?? '';
  inputLabelColor.value = itemProps.label?.fillColor ?? '';
  inputLabelVerticalAlign.value =
    itemProps.label?.verticalAlignment != null ? String(itemProps.label.verticalAlignment) : '';
  inputLabelHorizontalAlign.value =
    itemProps.label?.horizontalAlignment != null ? String(itemProps.label.horizontalAlignment) : '';

  dialog.showModal();
}

function onItemsSelected(items: any[]) {
  console.log('Items selected:', items);
}

function onCreatorStart(data: any) {
  console.log('Creator started:', data);
  tooltip.classList.add('visible');
}

function onCreatorMove(data: any) {
  // console.log('Creator moved:', data);
  tooltip.style.left = data.centerRight.x + 'px';
  tooltip.style.top = data.centerRight.y + 'px';
  tooltip.innerText = `Items: (${data.count}), Rotation: ${data.rotation}°`;
  tooltip.classList.add('visible');
  tooltip.style.transform = `translate(0, -50%) rotate(${data.rotation}deg)`;
  tooltip.style.transformOrigin = `center left`;
}

function onCreatorEnd(data: any) {
  console.log('Creator ended:', data);
  tooltip.classList.remove('visible');
}

function onTransformChange(data: any) {
  console.log('Transform changed:', data);
  transformerOpts.style.left = data.rectPoints.topRight.x + 'px';
  transformerOpts.style.top = data.rectPoints.topRight.y + 'px';
  transformerOpts.innerText = `${data.rotation.toFixed(2)}°`;
  transformerOpts.style.transform = getTranslateForRotation(data.rotation);
}

function onTransformEnd(data: any) {
  console.log('Transform ended:', data);
  transformerOpts.classList.remove('visible');
}

function onTransformStart(data: any) {
  console.log('Transform started:', data);
  transformerOpts.classList.add('visible');
  transformerOpts.style.left = data.rectPoints.topRight.x + 'px';
  transformerOpts.style.top = data.rectPoints.topRight.y + 'px';
  transformerOpts.innerText = `${data.rotation.toFixed(2)}°`;
  transformerOpts.style.transform = getTranslateForRotation(data.rotation);
}

const {
  setStageMode,
  // setStagePosition,
  setXAlignment,
  setYAlignment,
  setAlignmentInCols,
  spreadItemsByCircle,
  setSpreadByOpts,
  setCreatorCurrentItem,
  setGap,
  setColumns,
  setRotation,
  setRotationAngle,
  discardSelection,
  deleteSelectedItems,
  cloneSelectedItems,
  centerStageOnObjectById,
  updateItemById,
} = setStage({
  stageContainer,
  onViewportChange,
  onViewModeChange,
  onItemMouseOver,
  onItemMouseOut,
  onItemMouseClick,
  onItemsSelected,
  onCreatorStart,
  onCreatorMove,
  onCreatorEnd,
  onTransformChange,
  onTransformEnd,
  onTransformStart,
});

const modeSelector = document.querySelector<HTMLSelectElement>('#select-mode')!;
const alignXButton = document.querySelector<HTMLButtonElement>('#btn-align-x')!;
const alignYButton = document.querySelector<HTMLButtonElement>('#btn-align-y')!;
const alignColsButton = document.querySelector<HTMLButtonElement>('#btn-align-cols')!;
const cloneButton = document.querySelector<HTMLButtonElement>('#btn-clone')!;

const rotateButton = document.querySelector<HTMLButtonElement>('#btn-rotate')!;
const angleInput = document.querySelector<HTMLInputElement>('#input-rotate')!;

const spreadByCircleButton = document.querySelector<HTMLButtonElement>('#btn-spread-circle')!;

const rotationMode = document.querySelector<HTMLSelectElement>('#select-rotation')!;
const rotationRadius = document.querySelector<HTMLInputElement>('#input-radius')!;

const computerItemButton = document.querySelector<HTMLButtonElement>('#btn-creator-computer')!;
const parkingItemButton = document.querySelector<HTMLButtonElement>('#btn-creator-parking')!;

const gapInput = document.querySelector<HTMLInputElement>('#input-gap')!;
const columnsInput = document.querySelector<HTMLInputElement>('#input-cols')!;

const dialog = document.querySelector<HTMLDialogElement>('#item-dialog')!;
const btnCenterItem = document.querySelector<HTMLButtonElement>('#btn-center-item')!;
const transformerOpts = document.querySelector<HTMLDivElement>('#transformer-opts')!;

// Item edit form elements
const inputBgColor = document.querySelector<HTMLInputElement>('#input-bg-color')!;
const inputStrokeColor = document.querySelector<HTMLInputElement>('#input-stroke-color')!;
const inputStrokeWidth = document.querySelector<HTMLInputElement>('#input-stroke-width')!;
const inputLabelText = document.querySelector<HTMLInputElement>('#input-label-text')!;
const inputLabelFontSize = document.querySelector<HTMLInputElement>('#input-label-font-size')!;
const inputLabelFontFamily = document.querySelector<HTMLInputElement>('#input-label-font-family')!;
const inputLabelColor = document.querySelector<HTMLInputElement>('#input-label-color')!;
const inputLabelVerticalAlign = document.querySelector<HTMLInputElement>('#input-label-vertical')!;
const inputLabelHorizontalAlign = document.querySelector<HTMLInputElement>('#input-label-horizontal')!;
const btnApplyChanges = document.querySelector<HTMLButtonElement>('#btn-apply-changes')!;

gapInput.addEventListener('change', () => {
  const gap = gapInput.value ? parseInt(gapInput.value, 10) : 10;
  console.log('Setting gap to:', gap);
  setGap(gap);
});

columnsInput.addEventListener('change', () => {
  const cols = columnsInput.value ? parseInt(columnsInput.value, 10) : 3;
  console.log('Setting columns to:', cols);
  setColumns(cols);
});

rotationMode.addEventListener('change', () => {
  let value = rotationMode.value as any;
  if (value === 'none') {
    value = null;
  }

  const rotationValue = rotationRadius.value ? parseInt(rotationRadius.value, 10) : 500;
  setSpreadByOpts({ withRotation: value as RotationMode, radius: rotationValue });
});

rotationRadius.addEventListener('change', () => {
  let value = rotationMode.value as any;
  if (value === 'none') {
    value = null;
  }

  console.log('on change rotation radius');

  const rotationValue = rotationRadius.value ? parseInt(rotationRadius.value, 10) : 500;
  setSpreadByOpts({ withRotation: value as RotationMode, radius: rotationValue });
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

alignColsButton.addEventListener('click', () => {
  setAlignmentInCols();
});

rotateButton.addEventListener('click', () => {
  setRotation();
});

cloneButton.addEventListener('click', () => {
  cloneSelectedItems();
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

btnCenterItem.addEventListener('click', () => {
  const itemId = dialog.getAttribute('data-item-id');
  if (itemId) {
    centerStageOnObjectById(itemId);
  }
});

btnApplyChanges.addEventListener('click', () => {
  const itemId = dialog.getAttribute('data-item-id');
  if (!itemId) return;

  updateItemById(itemId, {
    background: {
      backgroundColor: inputBgColor.value,
      strokeColor: inputStrokeColor.value,
      strokeWidth: parseFloat(inputStrokeWidth.value),
    },
    label: {
      text: inputLabelText.value,
      fontSize: parseInt(inputLabelFontSize.value, 10),
      fontFamily: inputLabelFontFamily.value,
      fillColor: inputLabelColor.value,
      verticalAlignment: parseInt(inputLabelVerticalAlign.value, 10),
      horizontalAlignment: parseInt(inputLabelHorizontalAlign.value, 10),
    },
  });
});

transformerOpts.addEventListener('click', (ev) => {
  ev.stopPropagation();
  console.log('opts clicked');
});

stageContainer.tabIndex = 1;

setTimeout(() => {
  // setStageScale({ x: 0.5, y: 0.5 });
}, 2000);
