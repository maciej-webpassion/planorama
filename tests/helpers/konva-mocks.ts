import { Group } from 'konva/lib/Group';
import { Layer } from 'konva/lib/Layer';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { Stage } from 'konva/lib/Stage';

/**
 * Create a mock Stage instance for testing
 */
export function createMockStage(config: Partial<{ width: number; height: number }> = {}) {
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.height = '600px';
  document.body.appendChild(container);

  return new Stage({
    container,
    width: config.width ?? 800,
    height: config.height ?? 600,
  });
}

/**
 * Create a mock Layer instance for testing
 */
export function createMockLayer(config = {}) {
  return new Layer(config);
}

/**
 * Create a mock Group (item) for testing
 */
export function createMockGroup(
  config: Partial<{
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
  }> = {}
) {
  return new Group({
    x: config.x ?? 0,
    y: config.y ?? 0,
    width: config.width ?? 100,
    height: config.height ?? 100,
    name: config.name ?? 'test-item',
    ...config,
  });
}

/**
 * Create a mock Transformer for testing
 */
export function createMockTransformer(config = {}) {
  return new Transformer(config);
}

/**
 * Cleanup stage after test
 */
export function cleanupStage(stage: Stage) {
  const container = stage.container();
  stage.destroy();
  container.remove();
}
