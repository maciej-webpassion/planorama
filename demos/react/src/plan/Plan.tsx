import { useState } from 'react';

import { Box } from '@mui/material';

import { usePlanorama } from '../hooks/usePlanorama';
import { Canvas } from './components/Canvas';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { Toolbar } from './components/Toolbar';

import type { ItemConfig, PlanoramaItem, Vector2d } from '@maciejwegrzynek/planorama';

// Define item types for the demo
const ITEMS_CONFIG: ItemConfig[] = [
  {
    name: 'parking-spot',
    width: 90,
    height: 180,
    src: '/spot-1.svg',
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
    src: '/computer.svg',
    scale: { x: 0.1, y: 0.1 },
    label: {
      defaultText: 'PC',
      fontSize: 16,
      fontFamily: 'Helvetica',
      fillColor: '#003306',
    },
  },
];

export function Plan() {
  const [currentItemType, setCurrentItemType] = useState<ItemConfig | null>(null);
  const [clickedItem, setClickedItem] = useState<PlanoramaItem | null>(null);

  const planorama = usePlanorama({
    itemsConfig: ITEMS_CONFIG,
    backgroundConfig: {
      src: '/bg-test.svg',
      scale: 1.9,
    },
    debug: true,
    onViewportChange: (data: { scale: Vector2d; position: Vector2d }) => {
      console.log('Viewport changed:', data);
    },
    onItemMouseClick: (item: PlanoramaItem) => {
      console.log('Item clicked:', item);
      setClickedItem(item);
    },
    onItemsSelected: (items: PlanoramaItem[]) => {
      console.log('Items selected:', items);
    },
  });

  const { containerRef, isReady, mode, scale, position, selectedItems, setStageMode, setCreatorCurrentItem } =
    planorama;

  // Handle mode changes and set creator item
  const handleCreateMode = (itemConfig: ItemConfig) => {
    setCurrentItemType(itemConfig);
    setCreatorCurrentItem(itemConfig);
    setStageMode('create');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar
        planorama={planorama}
        isReady={isReady}
        mode={mode}
        currentItemType={currentItemType}
        itemsConfig={ITEMS_CONFIG}
        onCreateMode={handleCreateMode}
      />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          planorama={planorama}
          isReady={isReady}
          itemsConfig={ITEMS_CONFIG}
          onCreateMode={handleCreateMode}
          currentItemType={currentItemType}
        />

        <Canvas containerRef={containerRef} isReady={isReady} />
      </Box>

      <StatusBar
        mode={mode}
        scale={scale}
        position={position}
        selectedItems={selectedItems}
        clickedItem={clickedItem}
      />
    </Box>
  );
}
