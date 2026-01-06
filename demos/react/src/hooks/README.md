# usePlanorama Hook

A comprehensive React hook for integrating the Planorama 2D planning library into React applications.

## Features

- ✅ **Full API Coverage** - All Planorama methods wrapped with React-friendly APIs
- ✅ **Reactive State** - Automatic state updates for viewport, selection, and mode changes
- ✅ **Type Safety** - Complete TypeScript support with proper type inference
- ✅ **Simple Integration** - Just use the hook and attach the ref to your container
- ✅ **Automatic Cleanup** - Handles Konva stage destruction on unmount
- ✅ **Callback Wrapping** - Seamlessly integrates Planorama callbacks with React state

## Installation

```bash
npm install @maciejwegrzynek/planorama
```

## Basic Usage

```tsx
import { usePlanorama } from './hooks/usePlanorama';

function MyPlanningApp() {
  const { containerRef, isReady, setStageMode, setCreatorCurrentItem } =
    usePlanorama({
      itemsConfig: [
        {
          name: 'parking-spot',
          width: 90,
          height: 180,
          src: '/assets/spot.svg',
          scale: { x: 1, y: 1 },
        },
      ],
      backgroundConfig: {
        src: '/assets/background.svg',
        scale: 1.9,
      },
    });

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
      {isReady && (
        <button onClick={() => setStageMode('create')}>Start Creating</button>
      )}
    </div>
  );
}
```

## API Reference

### Hook Configuration

The `usePlanorama` hook accepts a configuration object with the following properties:

```tsx
interface UsePlanoramaConfig {
  /** Array of item types that can be created */
  itemsConfig: ItemConfig[];

  /** Background image configuration (optional) */
  backgroundConfig?: BackgroundConfig;

  /** Enable debug logging (default: false) */
  debug?: boolean;

  /** Optional: Provide your own container element */
  stageContainer?: HTMLDivElement;

  // Callbacks
  onViewportChange?: (data: { scale: Vector2d; position: Vector2d }) => void;
  onViewModeChange?: (mode: StageMode) => void;
  onItemMouseOver?: (item: PlanoramaItem) => void;
  onItemMouseOut?: (item: PlanoramaItem) => void;
  onItemMouseClick?: (item: PlanoramaItem) => void;
  onItemsSelected?: (items: PlanoramaItem[]) => void;
  onCreatorStart?: (data: any) => void;
  onCreatorMove?: (data: any) => void;
  onCreatorEnd?: (data: any) => void;
  onTransformChange?: (data: any) => void;
  onTransformEnd?: (data: any) => void;
  onTransformStart?: (data: any) => void;
}
```

### Return Value

The hook returns an object with the following properties and methods:

#### Reactive State

```tsx
{
  /** Ref to attach to the container div element */
  containerRef: React.RefObject<HTMLDivElement>;

  /** Whether Planorama is initialized and ready */
  isReady: boolean;

  /** Current stage mode: 'viewport' | 'select' | 'create' | null */
  mode: StageMode | null;

  /** Current viewport scale/zoom level */
  scale: Vector2d | null;

  /** Current viewport position */
  position: Vector2d | null;

  /** Currently selected items */
  selectedItems: PlanoramaItem[];

  /** Konva Stage instance (available after initialization) */
  stage: Stage | null;
}
```

#### Stage Management Methods

```tsx
{
  /** Set stage scale/zoom level */
  setStageScale: (scale: Vector2d) => void;

  /** Set stage position (pan) */
  setStagePosition: (position: Vector2d) => void;

  /** Center viewport on specific item by ID */
  centerStageOnObjectById: (id: string) => void;

  /** Center viewport on all items and fit them on screen */
  centerOnItems: (duration?: number) => void;

  /** Change stage interaction mode */
  setStageMode: (mode: StageMode) => void;
}
```

#### Item Alignment Methods

```tsx
{
  /** Align selected items horizontally */
  setXAlignment: (gap?: number) => void;

  /** Align selected items vertically */
  setYAlignment: (gap?: number) => void;

  /** Align selected items in columns and rows */
  setAlignmentInCols: (cols?: number, gap?: number) => void;

  /** Spread selected items in a circle */
  spreadItemsByCircle: (spreadOpts?: SpreadByOpts) => void;

  /** Set options for circle spread */
  setSpreadByOpts: (opts: SpreadByOpts) => void;
}
```

#### Item Creation Methods

```tsx
{
  /** Set current item type for creator mode */
  setCreatorCurrentItem: (config: ItemConfig) => void;
}
```

#### Item Manipulation Methods

```tsx
{
  /** Rotate selected items */
  setRotation: (rotationAngle?: number) => void;

  /** Set default rotation angle for alignment */
  setRotationAngle: (angle: number) => void;

  /** Set default gap for alignment operations */
  setGap: (gap: number) => void;

  /** Set default number of columns for alignment */
  setColumns: (cols: number) => void;

  /** Deselect all items */
  discardSelection: () => void;

  /** Delete currently selected items */
  deleteSelectedItems: () => void;

  /** Clone currently selected items */
  cloneSelectedItems: () => void;

  /** Update properties of specific item by ID */
  updateItemById: (itemId: string, updates: ItemUpdatePayload) => void;

  /** Select items by their IDs */
  selectItemsById: (ids: string[] | string) => void;

  /** Export all items on stage to array */
  exportAllItems: (callback: (items: PlanoramaItem[]) => void) => void;

  /** Import items onto stage */
  importItems: (items: PlanoramaItem[]) => void;
}
```

## Complete Example

See [usePlanorama.example.tsx](./usePlanorama.example.tsx) for a complete working example that demonstrates:

- Mode switching (Viewport, Select, Create)
- Item creation with multiple item types
- Zoom and pan controls
- Item alignment (horizontal, vertical, grid, circle)
- Item transformation (rotate, clone, delete)
- Import/Export functionality
- Real-time state display

## Usage Patterns

### Mode Management

```tsx
const { mode, setStageMode } = usePlanorama(config);

// Switch to viewport mode for navigation
<button onClick={() => setStageMode('viewport')}>
  Navigate
</button>

// Switch to select mode for item manipulation
<button onClick={() => setStageMode('select')}>
  Select Items
</button>

// Switch to create mode and set item type
<button onClick={() => {
  setCreatorCurrentItem(itemConfig);
  setStageMode('create');
}}>
  Create Items
</button>
```

### Viewport Control

```tsx
const { scale, setStageScale, centerOnItems } = usePlanorama(config);

// Zoom in
<button onClick={() =>
  scale && setStageScale({ x: scale.x + 0.1, y: scale.y + 0.1 })
}>
  Zoom In
</button>

// Fit all items
<button onClick={() => centerOnItems()}>
  Fit All
</button>
```

### Item Selection and Manipulation

```tsx
const {
  selectedItems,
  deleteSelectedItems,
  cloneSelectedItems,
  setRotation,
} = usePlanorama(config);

// Only enable when items are selected
<button
  onClick={() => deleteSelectedItems()}
  disabled={selectedItems.length === 0}
>
  Delete ({selectedItems.length})
</button>

<button
  onClick={() => cloneSelectedItems()}
  disabled={selectedItems.length === 0}
>
  Clone
</button>

<button
  onClick={() => setRotation(45)}
  disabled={selectedItems.length === 0}
>
  Rotate 45°
</button>
```

### Item Alignment

```tsx
const {
  selectedItems,
  setXAlignment,
  setYAlignment,
  setAlignmentInCols,
  spreadItemsByCircle,
} = usePlanorama(config);

// Require at least 2 items for alignment
const canAlign = selectedItems.length >= 2;

<button onClick={() => setXAlignment(10)} disabled={!canAlign}>
  Align Horizontally
</button>

<button onClick={() => setYAlignment(10)} disabled={!canAlign}>
  Align Vertically
</button>

<button onClick={() => setAlignmentInCols(3, 10)} disabled={!canAlign}>
  Grid (3 columns)
</button>

<button
  onClick={() => spreadItemsByCircle({
    radius: 300,
    withRotation: 'outside'
  })}
  disabled={!canAlign}
>
  Circle Pattern
</button>
```

### Export and Import

```tsx
const { exportAllItems, importItems } = usePlanorama(config);

// Export to JSON
const handleExport = () => {
  exportAllItems((items) => {
    const json = JSON.stringify(items, null, 2);
    // Save to file or send to backend
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
  });
};

// Import from JSON
const handleImport = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const items = JSON.parse(e.target.result as string);
    importItems(items);
  };
  reader.readAsText(file);
};
```

### Working with Callbacks

```tsx
const [hoveredItem, setHoveredItem] = useState<PlanoramaItem | null>(null);

const planorama = usePlanorama({
  itemsConfig,
  backgroundConfig,

  // Callbacks update your React state
  onItemMouseOver: (item) => {
    setHoveredItem(item);
  },

  onItemMouseOut: () => {
    setHoveredItem(null);
  },

  onItemMouseClick: (item) => {
    console.log('Clicked:', item);
    // Update your UI, show details, etc.
  },

  onViewportChange: (data) => {
    // Track viewport changes for analytics or state sync
  },
});

// Display hovered item info
{
  hoveredItem && <div>Hovering: {hoveredItem.type}</div>;
}
```

## Best Practices

1. **Container Sizing**: Always provide explicit dimensions to the container div
2. **Check isReady**: Disable UI controls until Planorama is initialized
3. **Validation**: Check `selectedItems.length` before enabling selection-dependent actions
4. **Cleanup**: The hook handles cleanup automatically, no manual cleanup needed
5. **Performance**: Use `useCallback` for event handlers to prevent unnecessary re-renders
6. **Type Safety**: Leverage TypeScript types for better development experience

## TypeScript Support

The hook is fully typed and exports all necessary types:

```tsx
import type {
  ItemConfig,
  PlanoramaItem,
  StageMode,
  Vector2d,
  SpreadByOpts,
  ItemUpdatePayload,
} from '@maciejwegrzynek/planorama';
```

## License

Same as Planorama library.
