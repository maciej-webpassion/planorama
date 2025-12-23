import { BackgroundConfig, ItemConfig } from '../lib';

export const ITEMS_CONFIG: ItemConfig[] = [
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

export const BACKGROUND_CONFIG: BackgroundConfig = {
  src: 'assets/bg-test.svg',
  scale: 1.9,
  offset: { x: 0, y: 0 },
};
