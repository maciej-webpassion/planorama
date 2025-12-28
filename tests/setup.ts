import { beforeEach, vi } from 'vitest';

// Mock canvas globally for Konva.js
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  miterLimit: 10,
  lineDashOffset: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  shadowColor: 'rgba(0, 0, 0, 0)',
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  font: '10px sans-serif',
  textAlign: 'start',
  textBaseline: 'alphabetic',
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  rect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  clip: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  drawImage: vi.fn(),
  createImageData: vi.fn(() => ({ data: [], width: 0, height: 0 })),
  getImageData: vi.fn(() => ({ data: [], width: 0, height: 0 })),
  putImageData: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  setLineDash: vi.fn(),
  getLineDash: vi.fn(() => []),
  createLinearGradient: vi.fn(),
  createRadialGradient: vi.fn(),
  createPattern: vi.fn(),
  isPointInPath: vi.fn(),
  isPointInStroke: vi.fn(),
})) as any;

// Mock HTMLCanvasElement methods
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => '');
HTMLCanvasElement.prototype.toBlob = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
