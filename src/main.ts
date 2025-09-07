import './style.css';

import { setStage, Vector2d } from './core/services/stage.ts';

const stageContainer = document.querySelector<HTMLDivElement>('#parkey-plan-stage')!;
function onViewportChange(data: { scale: Vector2d; position: Vector2d }) {
  // console.log(data);
}

const { setStageMode, setXAlignment } = setStage({ stageContainer, onViewportChange });

const modeSelector = document.querySelector<HTMLSelectElement>('#select-mode')!;
const alignXButton = document.querySelector<HTMLButtonElement>('#btn-align-x')!;
const alignYButton = document.querySelector<HTMLButtonElement>('#btn-align-y')!;

modeSelector.addEventListener('change', () => {
  setStageMode(modeSelector.value as any);
});

alignXButton.addEventListener('click', () => {
  setXAlignment();
});

// alignYButton.addEventListener("click", () => {
//   setYAlignment();
// });

setTimeout(() => {
  // setStageScale({ x: 0.5, y: 0.5 });
}, 2000);
