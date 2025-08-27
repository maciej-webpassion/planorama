import "./style.css";

import { setStage, Vector2d } from "./core/services/stage.ts";

const stageContainer = document.querySelector<HTMLDivElement>("#parkey-plan-stage")!;
function onViewportChange(data: { scale: Vector2d; position: Vector2d }) {
  // console.log(data);
}

const { setStageMode } = setStage({ stageContainer, onViewportChange });

const modeSelector = document.querySelector<HTMLSelectElement>("#select-mode")!;

modeSelector.addEventListener("change", () => {
  setStageMode(modeSelector.value as any);
});

setTimeout(() => {
  // setStageScale({ x: 0.5, y: 0.5 });
}, 2000);
