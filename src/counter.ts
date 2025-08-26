import { effect, signal } from '@preact/signals-core';

export const counter = signal(0);
export function setupCounter(element: HTMLButtonElement) {
  const setCounter = (count: number) => {
    counter.value = count;
  };
  element.addEventListener("click", () => setCounter(counter.value + 1));

  effect(() => (element.innerHTML = `count is ${counter.value}`));

  setCounter(0);
}
