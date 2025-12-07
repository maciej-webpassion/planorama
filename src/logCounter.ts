import { effect } from '@preact/signals-core';

import { counter } from './calc';

export function logCounter() {
  effect(() => console.log(`count is ${counter.value}`));
}

export function resetCounter() {
  counter.value = 0;
}

export function setupResetCounter(element: HTMLButtonElement) {
  element.addEventListener('click', () => resetCounter());
}
