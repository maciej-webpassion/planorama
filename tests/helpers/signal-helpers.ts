import { batch, Signal } from '@preact/signals-core';

/**
 * Reset a single signal to its default value
 */
export function resetSignal<T>(signal: Signal<T>, defaultValue: T): void {
  signal.value = defaultValue;
}

/**
 * Reset multiple signals at once using batch
 */
export function resetSignals(...resets: Array<[Signal<any>, any]>): void {
  batch(() => {
    resets.forEach(([signal, defaultValue]) => {
      signal.value = defaultValue;
    });
  });
}

/**
 * Get a snapshot of a signal's value for comparison
 */
export function getSignalSnapshot<T>(signal: Signal<T>): T {
  return JSON.parse(JSON.stringify(signal.value));
}

/**
 * Wait for signal to change to expected value
 */
export function waitForSignalValue<T>(signal: Signal<T>, expectedValue: T, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Signal did not change to expected value within ${timeout}ms`));
    }, timeout);

    const checkValue = () => {
      if (JSON.stringify(signal.value) === JSON.stringify(expectedValue)) {
        clearTimeout(timeoutId);
        resolve();
      } else {
        setTimeout(checkValue, 10);
      }
    };

    checkValue();
  });
}
