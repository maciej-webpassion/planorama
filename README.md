# Planorama

A TypeScript library for creating and managing 2D plans like parkings, gardens, playgrounds, and more using Konva.js and reactive state management.

## What is Planorama?

Planorama is a powerful yet simple library that lets you create interactive 2D plans for any layout - parking lots, office spaces, gardens, playgrounds, seating arrangements, and more. Built on top of Konva.js with reactive state management, it handles all the complexity of canvas rendering, item manipulation, and user interactions.

### Getting Started is Simple

Creating your first 2D plan requires just a few steps:

1. **Define a background** - Load your floor plan, map, or any SVG/image as the base layer
2. **Define items** - Create reusable item types (parking spots, desks, trees, equipment, etc.)
3. **Build your UI** - Use React, Vue, Svelte, or vanilla JavaScript to create controls
4. **Start creating** - Let users place, move, rotate, and arrange items on the canvas

That's it! Planorama handles viewport navigation, item selection, transformations, and all the canvas complexity for you.

## Demo & Live Examples

- 🚀 [**Live Demo**](https://planorama.webpassion.pl/demo/) - Try it out in your browser
- 💻 [**Stackblitz Demo**](https://stackblitz.com/edit/planorama-demo?file=src%2Fmain.ts) - Explore and edit the code online
- 📦 [**NPM Package**](https://www.npmjs.com/package/@maciejwegrzynek/planorama) - View package details and documentation

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Use Cases](#use-cases)
- [API Reference](#api-reference)
  - [Initialization](#initialization)
  - [Stage Management](#stage-management)
    - [setStageScale](#setstagescale)
    - [setStagePosition](#setstageposition)
    - [centerStageOnObjectById](#centerstageobjectbyid)
    - [centerOnItems](#centeronItems)
    - [setStageMode](#setstagemode)
  - [Item Alignment](#item-alignment)
    - [setXAlignment](#setxalignment)
    - [setYAlignment](#setyalignment)
    - [setAlignmentInCols](#setalignmentincols)
    - [spreadItemsByCircle](#spreaditemsbycircle)
  - [Item Creation](#item-creation)
    - [setCreatorCurrentItem](#setcreatorcurrentitem)
  - [Item Manipulation](#item-manipulation)
    - [setRotation](#setrotation)
    - [cloneSelectedItems](#cloneselecteditems)
    - [deleteSelectedItems](#deleteselecteditems)
    - [discardSelection](#discardselection)
    - [selectItemsById](#selectitemsbyid)
    - [updateItemById](#updateitembyid)
    - [exportAllItems](#exportallitems)
  - [Configuration](#configuration)
    - [setGap](#setgap)
    - [setColumns](#setcolumns)
    - [setRotationAngle](#setrotationangle)
    - [setSpreadByOpts](#setspreadbyopts)
- [Callbacks](#callbacks)
  - [onViewportChange](#onviewportchange)
  - [onViewModeChange](#onviewmodechange)
  - [onItemMouseOver](#onitemmouseover)
  - [onItemMouseOut](#onitemmouseout)
  - [onItemMouseClick](#onitemmouseclick)
  - [onItemsSelected](#onitemsselected)
  - [onCreatorStart](#oncreatorstart)
  - [onCreatorMove](#oncreatormove)
  - [onCreatorEnd](#oncreatorend)
  - [onTransformChange](#ontransformchange)
  - [onTransformEnd](#ontransformend)
  - [onTransformStart](#ontransformstart)
- [Type Definitions](#type-definitions)
  - [Vector2d](#vector2d-1)
  - [StageMode](#stagemode-1)
  - [ItemConfig](#itemconfig)
  - [BackgroundConfig](#backgroundconfig)
  - [ItemUpdatePayload](#itemupdatepayload)
  - [SpreadByOpts](#spreadbyopts)
- [Examples](#examples)

## Installation

```bash
npm install @maciejwegrzynek/planorama
```

## Quick Start

```typescript
import { setPlanorama } from '@maciejwegrzynek/planorama';

const container = document.querySelector('#planorama-stage')!;

const itemsConfig = [
  {
    name: 'parking-spot',
    width: 90,
    height: 180,
    src: 'assets/spot.svg',
    scale: { x: 1, y: 1 },
  },
];

const { setStageMode, setCreatorCurrentItem } = setPlanorama({
  stageContainer: container,
  itemsConfig,
  backgroundConfig: {
    src: 'assets/background.svg',
    scale: 1.9,
  },
  onViewportChange: (data) => {
    console.log('Viewport changed:', data);
  },
  onItemMouseClick: (item) => {
    console.log('Item clicked:', item);
  },
});

// Set mode to create items
setStageMode('create');

// Configure an item to create
setCreatorCurrentItem(itemsConfig[0]);
```

---

## Use Cases

Planorama is designed to handle various 2D planning scenarios where administrators need to create layouts and users need to interact with specific areas or objects. Here are some practical applications:

### Parking Management System

**Admin Role:**

- Create a new parking facility by uploading a floor plan or satellite image as the background
- Define parking spots by placing spot items on the canvas
- Add additional elements like entrances, exits, payment kiosks, EV charging stations, and disabled parking zones
- Configure spot properties (size, type, restrictions, pricing)
- Organize spots using alignment tools for consistent spacing

**User Role:**

- Browse the interactive parking map
- View real-time availability of parking spots
- Click to select and book a specific parking spot
- See spot details (dimensions, features, distance to entrance)
- Receive visual confirmation of their reserved spot

### Office Space Planning

**Admin Role:**

- Upload office floor plans as the background layer
- Place and arrange desks, meeting rooms, and collaborative spaces
- Add facilities like printers, coffee stations, emergency exits, and restrooms
- Define hot-desking zones vs. assigned workstations
- Configure room capacities and equipment lists

**User Role:**

- View the office layout and available desks
- Book a desk for specific dates (hot-desking)
- See which colleagues are seated nearby
- Find meeting rooms and check their availability
- Navigate to facilities like printers or break rooms

### Event Venue & Seating Management

**Admin Role:**

- Import venue layout (theater, conference hall, stadium)
- Create seating sections with different categories (VIP, standard, accessible)
- Place tables for banquet-style events
- Define stage, entrance, exit, and emergency assembly points
- Set pricing tiers for different seating areas

**User Role:**

- Browse available seats with interactive venue map
- Select specific seats based on view preferences
- Book multiple adjacent seats for groups
- View seat details (row, number, view angle, accessibility)
- Receive seat assignment confirmation with visual reference

### Garden & Landscape Design

**Admin Role:**

- Load property survey or satellite imagery as background
- Place various plant types, trees, and shrubs on the layout
- Add hardscape elements like paths, patios, water features, and fences
- Organize plants in rows or circular patterns using alignment tools
- Annotate with planting zones and maintenance areas

**User Role:**

- Visualize the proposed garden design
- Select specific plants to view details (species, care requirements, mature size)
- Provide feedback by highlighting areas for changes
- Track planting progress by marking completed sections
- Export the final design for implementation

### Playground & Recreation Area Planning

**Admin Role:**

- Create playground layout with equipment placement
- Define play zones (toddler area, climbing structures, swings, slides)
- Add safety elements like soft surfaces, fencing, and benches
- Mark shaded areas and water fountains
- Set age-appropriate zones with safety clearances

**User Role:**

- Explore playground features interactively
- View equipment specifications and age recommendations
- Report maintenance issues by clicking on specific equipment
- Plan visits based on available facilities
- Access accessibility information for inclusive play

### Warehouse & Inventory Management

**Admin Role:**

- Upload warehouse floor plan
- Define storage zones, shelving units, and pallet positions
- Create aisles, loading docks, and packing stations
- Label zones by product category or temperature requirements
- Configure storage capacity and weight limits

**User Role:**

- Locate specific inventory items on the warehouse map
- View stock levels by clicking on storage locations
- Plan picking routes for order fulfillment
- Update inventory status after stock movements
- Identify available storage space for new shipments

---

## API Reference

### Initialization

#### `setPlanorama(config: PlanoramaConfig): Planorama`

Initializes and returns the Planorama instance with all API methods.

**Parameters:**

- `config` ([PlanoramaConfig](#planoramaconfig)): Configuration object containing the stage container and optional callbacks

**Returns:** [Planorama](#planorama-1) - Instance with all API methods

**Example:**

```typescript
const itemsConfig = [
  {
    name: 'parking-spot',
    width: 90,
    height: 180,
    src: 'assets/spot.svg',
    scale: { x: 1, y: 1 },
  },
];

const planorama = setPlanorama({
  stageContainer: document.querySelector('#planorama-stage')!,
  itemsConfig,
  backgroundConfig: {
    src: 'assets/background.svg',
    scale: 1.9,
  },
  debug: false, // Optional: Enable debug logging
  onViewportChange: (data) => console.log('Viewport:', data),
  onItemMouseClick: (item) => console.log('Clicked:', item),
});

// Or destructure methods you need
const { setStageMode, setCreatorCurrentItem } = planorama;
```

---

### Stage Management

#### `setStageScale`

```typescript
setStageScale(scale: Vector2d): void
```

Sets the zoom level of the stage.

**Parameters:**

- `scale` ([Vector2d](#vector2d-1)): Object with `x` and `y` scale values (1 = 100%, 0.5 = 50%, 2 = 200%)

**Example:**

```typescript
const { setStageScale } = planorama;

// Zoom to 150%
setStageScale({ x: 1.5, y: 1.5 });

// Zoom out to 50%
setStageScale({ x: 0.5, y: 0.5 });
```

---

#### `setStagePosition`

```typescript
setStagePosition(position: Vector2d): void
```

Centers the stage on a specific position.

**Parameters:**

- `position` ([Vector2d](#vector2d-1)): Target position coordinates

**Example:**

```typescript
const { setStagePosition } = planorama;

setStagePosition({ x: 500, y: 300 });
```

---

#### `centerStageOnObjectById`

```typescript
centerStageOnObjectById(id: string): void
```

Centers the viewport on a specific item.

**Parameters:**

- `id` (string): Unique identifier of the item (e.g., 'item-abc123')

**Example:**

```typescript
const { centerStageOnObjectById } = planorama;

centerStageOnObjectById('item-parking-spot-1');
```

---

#### `centerOnItems`

```typescript
centerOnItems(duration?: number): void
```

Centers the viewport on all items and automatically calculates the optimal zoom level to fit them on screen with padding.

**Parameters:**

- `duration` (number, optional): Animation duration in seconds. If omitted, defaults to 0.3s

**Example:**

```typescript
const { centerOnItems } = planorama;

// After adding multiple items, fit them all on screen
centerOnItems();

// With custom animation duration (0.5 seconds)
centerOnItems(0.5);

// Instant fit without animation
centerOnItems(0);
```

**Notes:**

- Automatically calculates the bounding box of all items
- Adjusts zoom level to fit all items with 50px padding
- Animates the transition smoothly (default: 0.3s duration)
- Will not zoom in beyond 1:1 scale
- If no items exist, a warning is logged (in debug mode)

---

#### `setStageMode`

```typescript
setStageMode(mode: StageMode): void
```

Changes the interaction mode of the stage.

**Parameters:**

- `mode` ([StageMode](#stagemode-1)): One of: `'viewport'`, `'create'`, or `'select'`
  - `'viewport'`: Navigate and pan the stage
  - `'create'`: Create new items by clicking
  - `'select'`: Select and manipulate existing items

**Example:**

```typescript
const { setStageMode } = planorama;

// Switch to selection mode
setStageMode('select');

// Switch to creation mode
setStageMode('create');

// Switch to viewport navigation mode
setStageMode('viewport');
```

---

### Item Alignment

#### `setXAlignment`

```typescript
setXAlignment(gap?: number): void
```

Aligns selected items horizontally with equal spacing.

**Parameters:**

- `gap` (number, optional): Space between items in pixels. If omitted, uses the value from [setGap](#setgap)

**Example:**

```typescript
const { setXAlignment } = planorama;

// Align with default gap
setXAlignment();

// Align with custom 20px gap
setXAlignment(20);
```

---

#### `setYAlignment`

```typescript
setYAlignment(gap?: number): void
```

Aligns selected items vertically with equal spacing.

**Parameters:**

- `gap` (number, optional): Space between items in pixels. If omitted, uses the value from [setGap](#setgap)

**Example:**

```typescript
const { setYAlignment } = planorama;

// Align with default gap
setYAlignment();

// Align with custom 15px gap
setYAlignment(15);
```

---

#### `setAlignmentInCols`

```typescript
setAlignmentInCols(cols?: number, gap?: number): void
```

Aligns selected items in a grid layout with specified columns and spacing.

**Parameters:**

- `cols` (number, optional): Number of columns. If omitted, uses the value from [setColumns](#setcolumns)
- `gap` (number, optional): Space between items in pixels. If omitted, uses the value from [setGap](#setgap)

**Example:**

```typescript
const { setAlignmentInCols } = planorama;

// Align in 3 columns with default gap
setAlignmentInCols();

// Align in 4 columns with 10px gap
setAlignmentInCols(4, 10);

// Align in 5 columns with default gap
setAlignmentInCols(5);
```

---

#### `spreadItemsByCircle`

```typescript
spreadItemsByCircle(spreadOpts?: SpreadByOpts): void
```

Arranges selected items in a circular pattern.

**Parameters:**

- `spreadOpts` ([SpreadByOpts](#spreadbyopts), optional): Configuration for circular spread. If omitted, uses the value from [setSpreadByOpts](#setspreadbyopts)

**Example:**

```typescript
const { spreadItemsByCircle } = planorama;

// Spread with default options
spreadItemsByCircle();

// Spread in a circle with 300px radius and outward rotation
spreadItemsByCircle({
  radius: 300,
  withRotation: 'outside',
});

// Spread in a circle without rotation
spreadItemsByCircle({
  radius: 500,
  withRotation: null,
});
```

---

### Item Creation

#### `setCreatorCurrentItem`

```typescript
setCreatorCurrentItem(config: ItemConfig): void
```

Sets the item template for creation mode. After setting, items can be created by clicking on the stage when in `'create'` mode.

**Parameters:**

- `config` ([ItemConfig](#itemconfig)): Configuration for the item to create

**Example:**

```typescript
const { setCreatorCurrentItem, setStageMode } = planorama;

setCreatorCurrentItem({
  name: 'parking-spot',
  width: 90,
  height: 180,
  src: 'assets/parking.svg',
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
});

// Switch to create mode to start placing items
setStageMode('create');
```

---

### Item Manipulation

#### `setRotation`

```typescript
setRotation(rotationAngle?: number): void
```

Rotates selected items by the specified angle.

**Parameters:**

- `rotationAngle` (number, optional): Rotation angle in degrees. If omitted, uses the value from [setRotationAngle](#setrotationangle)

**Example:**

```typescript
const { setRotation } = planorama;

// Rotate by stored angle
setRotation();

// Rotate by 45 degrees
setRotation(45);

// Rotate by -90 degrees (counter-clockwise)
setRotation(-90);
```

---

#### `cloneSelectedItems`

```typescript
cloneSelectedItems(): void
```

Duplicates all currently selected items. The cloned items appear slightly offset from the originals.

**Example:**

```typescript
const { cloneSelectedItems } = planorama;

// Select items first, then clone them
cloneSelectedItems();
```

---

#### `deleteSelectedItems`

```typescript
deleteSelectedItems(): void
```

Removes all currently selected items from the stage.

**Example:**

```typescript
const { deleteSelectedItems } = planorama;

// Select items first, then delete them
deleteSelectedItems();
```

---

#### `discardSelection`

```typescript
discardSelection(): void
```

Clears the current selection without modifying any items.

**Example:**

```typescript
const { discardSelection } = planorama;

discardSelection();
```

---

#### `selectItemsById`

```typescript
selectItemsById(ids: string[] | string): void
```

Programmatically selects items by their IDs.

**Parameters:**

- `ids` (string[] | string): Single item ID or array of item IDs to select

**Example:**

```typescript
const { selectItemsById } = planorama;

// Select a single item
selectItemsById('item-abc123');

// Select multiple items
selectItemsById(['item-abc123', 'item-def456', 'item-ghi789']);
```

---

#### `updateItemById`

```typescript
updateItemById(itemId: string, updates: ItemUpdatePayload): void
```

Updates properties of an existing item by its ID.

**Parameters:**

- `itemId` (string): Unique identifier of the item to update
- `updates` ([ItemUpdatePayload](#itemupdatepayload)): Object containing properties to update

**Example:**

```typescript
const { updateItemById } = planorama;

updateItemById('item-abc123', {
  background: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    strokeColor: 'rgba(255, 0, 0, 0.8)',
    strokeWidth: 2,
  },
  label: {
    text: 'A-101',
    fontSize: 24,
    fillColor: '#000000',
  },
});
```

**See also:** [UPDATE_ITEM_EXAMPLE.md](src/docs/UPDATE_ITEM_EXAMPLE.md) for detailed documentation

---

#### `exportAllItems`

```typescript
exportAllItems(callback: (items: PlanoramaItem[]) => void): void
```

Exports all items from the stage as an array of [PlanoramaItem](#planoramaitem) objects. This is useful for saving, analyzing, or processing all items at once.

**Parameters:**

- `callback` (function): Callback function that receives the array of items

**Example:**

```typescript
const { exportAllItems } = planorama;

// Export all items and log them
exportAllItems((items) => {
  console.log('Total items:', items.length);
  console.log('Items data:', items);
});

// Save items to JSON
exportAllItems((items) => {
  const json = JSON.stringify(items, null, 2);
  localStorage.setItem('planorama-items', json);
  console.log('Items saved');
});

// Get all item IDs
exportAllItems((items) => {
  const ids = items.map((item) => item.id);
  console.log('Item IDs:', ids);
});

// Filter items by type
exportAllItems((items) => {
  const parkingSpots = items.filter((item) => item.type === 'parking-spot');
  const computers = items.filter((item) => item.type === 'computer-item');

  console.log(`Parking spots: ${parkingSpots.length}`);
  console.log(`Computers: ${computers.length}`);
});

// Export items with specific properties
exportAllItems((items) => {
  const exportData = items.map((item) => ({
    id: item.id,
    type: item.type,
    position: { x: item.transform.x, y: item.transform.y },
    rotation: item.transform.rotation,
    label: item.itemProps.label?.text,
  }));

  downloadJSON(exportData, 'planorama-export.json');
});
```

**See also:** [PlanoramaItem](#planoramaitem) type definition

---

#### `importItems`

```typescript
importItems(items: PlanoramaItem[]): void
```

Imports items into the stage. This method checks if items already exist by ID and either updates them or creates new ones. Useful for loading saved data or restoring a previous state.

**Parameters:**

- `items` ([PlanoramaItem](#planoramaitem)[]): Array of items to import

**Example:**

```typescript
const { importItems } = planorama;

// Load items from localStorage
const savedData = localStorage.getItem('planorama-items');
if (savedData) {
  const items = JSON.parse(savedData);
  importItems(items);
}

// Import items from an API
fetch('/api/planorama-data')
  .then((res) => res.json())
  .then((items) => importItems(items));

// Restore a specific state
const savedState = [
  {
    id: 'item-1',
    type: 'parking-spot',
    transform: { x: 100, y: 200, rotation: 0 },
    itemProps: {
      label: { text: 'A-1' },
    },
  },
];
importItems(savedState);
```

**Notes:**

- If an item with the same ID already exists, it will be updated with the provided properties
- If an item doesn't exist, it will be created at the specified position and rotation
- The item type must match one of the `itemsConfig` entries provided during initialization

---

### Configuration

#### `setGap`

```typescript
setGap(gap: number): void
```

Sets the default gap (spacing) between items for alignment operations.

**Parameters:**

- `gap` (number): Gap size in pixels

**Example:**

```typescript
const { setGap } = planorama;

setGap(15);
```

---

#### `setColumns`

```typescript
setColumns(cols: number): void
```

Sets the default number of columns for grid alignment operations.

**Parameters:**

- `cols` (number): Number of columns (minimum: 1)

**Example:**

```typescript
const { setColumns } = planorama;

setColumns(4);
```

---

#### `setRotationAngle`

```typescript
setRotationAngle(angle: number): void
```

Sets the default rotation angle for rotation operations.

**Parameters:**

- `angle` (number): Rotation angle in degrees

**Example:**

```typescript
const { setRotationAngle } = planorama;

// Set default rotation to 90 degrees
setRotationAngle(90);

// Set default rotation to 45 degrees
setRotationAngle(45);
```

---

#### `setSpreadByOpts`

```typescript
setSpreadByOpts(opts: SpreadByOpts): void
```

Sets the default options for circular spread operations.

**Parameters:**

- `opts` ([SpreadByOpts](#spreadbyopts)): Configuration for circular spread

**Example:**

```typescript
const { setSpreadByOpts } = planorama;

setSpreadByOpts({
  radius: 400,
  withRotation: 'outside',
});
```

---

## Callbacks

All callbacks are optional and can be provided in the initialization config.

### `onViewportChange`

```typescript
onViewportChange?: (data: { scale: Vector2d; position: Vector2d }) => void
```

Called when the viewport scale or position changes.

**Callback Data:**

- `scale` ([Vector2d](#vector2d-1)): Current zoom level
- `position` ([Vector2d](#vector2d-1)): Current viewport position

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onViewportChange: (data) => {
    console.log('Scale:', data.scale);
    console.log('Position:', data.position);
  },
});
```

---

### `onViewModeChange`

```typescript
onViewModeChange?: (mode: StageMode) => void
```

Called when the stage mode changes.

**Callback Data:**

- `mode` ([StageMode](#stagemode-1)): The new mode ('viewport', 'create', or 'select')

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onViewModeChange: (mode) => {
    console.log('Mode changed to:', mode);
    // Update UI to reflect current mode
  },
});
```

---

### `onItemMouseOver`

```typescript
onItemMouseOver?: (item: PlanoramaItem) => void
```

Called when the mouse hovers over an item.

**Callback Data:**

- `item` ([PlanoramaItem](#planoramaitem)): Object containing item details

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onItemMouseOver: (item) => {
    console.log('Hovering over:', item.id, item.type);
    // Show tooltip
    tooltip.textContent = item.id;
    tooltip.style.left = item.itemCenter.x + 'px';
    tooltip.style.top = item.itemCenter.y + 'px';
    tooltip.classList.add('visible');
  },
});
```

---

### `onItemMouseOut`

```typescript
onItemMouseOut?: (item: PlanoramaItem) => void
```

Called when the mouse leaves an item.

**Callback Data:**

- `item` ([PlanoramaItem](#planoramaitem)): Object containing item details

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onItemMouseOut: (item) => {
    console.log('Mouse left:', item.id);
    // Hide tooltip
    tooltip.classList.remove('visible');
  },
});
```

---

### `onItemMouseClick`

```typescript
onItemMouseClick?: (item: PlanoramaItem) => void
```

Called when an item is clicked.

**Callback Data:**

- `item` ([PlanoramaItem](#planoramaitem)): Object containing item details including `id`, `type`, `itemProps`, `boundingBox`, etc.

**Example:**

```typescript
const { centerStageOnObjectById } = setPlanorama({
  stageContainer: container,
  itemsConfig,
  onItemMouseClick: (item) => {
    console.log('Clicked item:', item.id);
    // Show item properties dialog
    showDialog(item);

    // Center on this item
    centerStageOnObjectById(item.id);
  },
});
```

---

### `onItemsSelected`

```typescript
onItemsSelected?: (items: Group[]) => void
```

Called when items are selected or selection changes.

**Callback Data:**

- `items` (Group[]): Array of Konva Group objects representing selected items

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onItemsSelected: (items) => {
    console.log(`${items.length} items selected`);
    // Update UI to show selection tools
    if (items.length > 0) {
      selectionTools.classList.add('visible');
    } else {
      selectionTools.classList.remove('visible');
    }
  },
});
```

---

### `onCreatorStart`

```typescript
onCreatorStart?: (data: any) => void
```

Called when item creation starts (mouse down in create mode).

**Callback Data:**

- `data`: Object containing creation start information

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onCreatorStart: (data) => {
    console.log('Started creating items');
    creatorIndicator.classList.add('visible');
  },
});
```

---

### `onCreatorMove`

```typescript
onCreatorMove?: (data: any) => void
```

Called continuously as the mouse moves during item creation.

**Callback Data:**

- `data`: Object containing:
  - `count`: Number of items being created
  - `rotation`: Current rotation angle
  - `centerRight`: Position for UI indicators

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onCreatorMove: (data) => {
    // Update creation indicator
    indicator.style.left = data.centerRight.x + 'px';
    indicator.style.top = data.centerRight.y + 'px';
    indicator.textContent = `Items: ${data.count}, Rotation: ${data.rotation}°`;
  },
});
```

---

### `onCreatorEnd`

```typescript
onCreatorEnd?: (data: any) => void
```

Called when item creation completes (mouse up in create mode).

**Callback Data:**

- `data`: Object containing creation completion information

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onCreatorEnd: (data) => {
    console.log('Finished creating items');
    creatorIndicator.classList.remove('visible');
  },
});
```

---

### `onTransformChange`

```typescript
onTransformChange?: (data: TransformData) => void
```

Called continuously during transformation (rotation, scaling, moving) of selected items.

**Callback Data:**

- `data`: Object containing:
  - `rotation`: Current rotation angle
  - `rectPoints`: Object with corner positions (topLeft, topRight, bottomLeft, bottomRight)

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onTransformChange: (data) => {
    // Show rotation indicator
    rotationIndicator.style.left = data.rectPoints.topRight.x + 'px';
    rotationIndicator.style.top = data.rectPoints.topRight.y + 'px';
    rotationIndicator.textContent = `${data.rotation.toFixed(1)}°`;
  },
});
```

---

### `onTransformEnd`

```typescript
onTransformEnd?: (data: TransformData) => void
```

Called when transformation completes.

**Callback Data:**

- `data`: Object containing final transformation state

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onTransformEnd: (data) => {
    console.log('Transform ended at rotation:', data.rotation);
    rotationIndicator.classList.remove('visible');
  },
});
```

---

### `onTransformStart`

```typescript
onTransformStart?: (data: TransformData) => void
```

Called when transformation begins.

**Callback Data:**

- `data`: Object containing initial transformation state

**Example:**

```typescript
const planorama = setPlanorama({
  stageContainer: container,
  onTransformStart: (data) => {
    console.log('Transform started');
    rotationIndicator.classList.add('visible');
  },
});
```

---

## Type Definitions

### Vector2d

Represents a 2D coordinate or scale.

```typescript
interface Vector2d {
  x: number;
  y: number;
}
```

**Example:**

```typescript
const position: Vector2d = { x: 100, y: 200 };
const scale: Vector2d = { x: 1.5, y: 1.5 };
```

---

### StageMode

Defines the interaction mode of the stage.

```typescript
type StageMode = 'viewport' | 'create' | 'select';
```

- `'viewport'`: Pan and navigate the stage
- `'create'`: Click to create items
- `'select'`: Select and manipulate items

---

### ItemConfig

Configuration for creating an item.

```typescript
interface ItemConfig {
  name: string; // Unique identifier for item type
  width: number; // Item width in pixels
  height: number; // Item height in pixels
  src: string; // Path to SVG or image file
  scale: { x: number; y: number }; // Scale multipliers
  label?: ItemLabelConfig; // Optional label configuration
  background?: ItemBackgroundColorConfig; // Optional background styling
}
```

**Example:**

```typescript
const itemConfig: ItemConfig = {
  name: 'parking-spot',
  width: 90,
  height: 180,
  src: 'assets/parking.svg',
  scale: { x: 1, y: 1 },
  label: {
    fontSize: 20,
    fontFamily: 'Arial',
    fillColor: '#333',
  },
};
```

---

### BackgroundConfig

Configuration for the stage background image.

```typescript
interface BackgroundConfig {
  src: string; // Path to SVG or image file
  scale: number; // Scale factor for the background
  offset?: Vector2d; // Optional: Manual offset from center {x, y} in pixels
}
```

**Example:**

```typescript
const backgroundConfig: BackgroundConfig = {
  src: 'assets/floor-plan.svg',
  scale: 2.0,
};

// With custom offset
const backgroundConfigWithOffset: BackgroundConfig = {
  src: 'assets/floor-plan.svg',
  scale: 1.5,
  offset: { x: 100, y: -50 }, // Move 100px right, 50px up from center
};
```

**Note:** The background image is automatically centered on the stage. The scale factor allows you to adjust the size of the background relative to the stage dimensions. Use the optional `offset` property to fine-tune the position by shifting the background from the center point.

---

### ItemUpdatePayload

Properties that can be updated on an existing item.

```typescript
interface ItemUpdatePayload {
  id?: string;
  background?: {
    backgroundColor?: string; // RGBA or hex color
    strokeColor?: string; // RGBA or hex color
    strokeWidth?: number; // Border width
  };
  label?: {
    text?: string; // Label text
    fontSize?: number; // Font size in pixels
    fontFamily?: string; // Font family
    fillColor?: string; // Text color
    verticalAlignment?: number; // 0-100 (percent from top)
    horizontalAlignment?: number; // 0-100 (percent from left)
  };
}
```

**Example:**

```typescript
const updates: ItemUpdatePayload = {
  background: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    strokeWidth: 2,
  },
  label: {
    text: 'Updated',
    fontSize: 24,
  },
};
```

---

### SpreadByOpts

Options for circular spread arrangement.

```typescript
interface SpreadByOpts {
  withRotation: 'outside' | 'inside' | null;
  radius: number;
}
```

- `withRotation`:
  - `'outside'`: Rotate items to face outward from center
  - `'inside'`: Rotate items to face inward to center
  - `null`: No rotation
- `radius`: Circle radius in pixels

**Example:**

```typescript
const spreadOpts: SpreadByOpts = {
  withRotation: 'outside',
  radius: 400,
};
```

---

### PlanoramaItem

Data structure passed to item callbacks.

```typescript
interface PlanoramaItem {
  id: string; // Unique item ID
  type: string; // Item type (from ItemConfig.name)
  itemProps: ItemUpdatePayload; // Current item properties
  boundingBox: IRect; // Bounding box dimensions
  pos: Vector2d; // Position
  scale: number; // Scale factor
  itemCenter: Vector2d; // Center point coordinates
  transform: {
    x: number;
    y: number;
    rotation: number;
  };
}
```

---

### PlanoramaConfig

Configuration object for initializing Planorama.

```typescript
interface PlanoramaConfig {
  stageContainer: HTMLDivElement;
  itemsConfig: ItemConfig[]; // Required: Array of item configurations
  backgroundConfig?: BackgroundConfig; // Optional: Background image configuration
  debug?: boolean; // Optional: Enable debug logging (default: false)
  onViewportChange?: (data: { scale: Vector2d; position: Vector2d }) => void;
  onViewModeChange?: (mode: StageMode) => void;
  onItemMouseOver?: (item: PlanoramaItem) => void;
  onItemMouseOut?: (item: PlanoramaItem) => void;
  onItemMouseClick?: (item: PlanoramaItem) => void;
  onItemsSelected?: (items: any[]) => void;
  onCreatorStart?: (data: any) => void;
  onCreatorMove?: (data: any) => void;
  onCreatorEnd?: (data: any) => void;
  onTransformChange?: (data: any) => void;
  onTransformEnd?: (data: any) => void;
  onTransformStart?: (data: any) => void;
}
```

---

### Planorama

Return type of `setPlanorama()` containing all API methods.

```typescript
interface Planorama {
  stage: Stage;
  setStageScale: (scale: Vector2d) => void;
  setStagePosition: (position: Vector2d) => void;
  centerStageOnObjectById: (id: string) => void;
  centerOnItems: (duration?: number) => void;
  setStageMode: (mode: StageMode) => void;
  setXAlignment: (gap?: number) => void;
  setYAlignment: (gap?: number) => void;
  setAlignmentInCols: (cols?: number, gap?: number) => void;
  spreadItemsByCircle: (spreadOpts?: SpreadByOpts) => void;
  setSpreadByOpts: (opts: SpreadByOpts) => void;
  setCreatorCurrentItem: (config: ItemConfig) => void;
  setRotation: (rotationAngle?: number) => void;
  setRotationAngle: (angle: number) => void;
  setGap: (gap: number) => void;
  setColumns: (cols: number) => void;
  discardSelection: () => void;
  deleteSelectedItems: () => void;
  cloneSelectedItems: () => void;
  updateItemById: (itemId: string, updates: ItemUpdatePayload) => void;
  selectItemsById: (ids: string[] | string) => void;
  exportAllItems: (callback: (items: PlanoramaItem[]) => void) => void;
  importItems: (items: PlanoramaItem[]) => void;
}
```

---

## Examples

### Complete Setup

```typescript
import { setPlanorama } from '@maciejwegrzynek/planorama';

const container = document.querySelector('#planorama-stage')!;

const itemsConfig = [
  {
    name: 'parking-spot',
    width: 90,
    height: 180,
    src: 'assets/parking.svg',
    scale: { x: 1.875, y: 1.875 },
  },
  {
    name: 'computer-item',
    width: 80,
    height: 80,
    src: 'assets/computer.svg',
    scale: { x: 0.1, y: 0.1 },
  },
];

const { setGap, setColumns, setRotationAngle } = setPlanorama({
  stageContainer: container,
  itemsConfig,
  backgroundConfig: {
    src: 'assets/floor-plan.svg',
    scale: 1.5,
  },
  debug: false,

  onViewportChange: (data) => {
    console.log('Viewport changed:', data.scale, data.position);
  },

  onViewModeChange: (mode) => {
    console.log('Mode:', mode);
    updateModeUI(mode);
  },

  onItemMouseClick: (item) => {
    console.log('Clicked:', item.id);
    showItemDialog(item);
  },

  onItemsSelected: (items) => {
    console.log(`${items.length} items selected`);
    toggleSelectionTools(items.length > 0);
  },

  onTransformChange: (data) => {
    showRotationIndicator(data.rotation, data.rectPoints.topRight);
  },
});

// Set up initial configuration
setGap(10);
setColumns(3);
setRotationAngle(90);
```

### Creating Items

```typescript
const { setStageMode, setCreatorCurrentItem } = planorama;

// Define item template
const parkingSpot = {
  name: 'parking-spot',
  width: 90,
  height: 180,
  src: 'assets/parking.svg',
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
};

// Switch to create mode
setStageMode('create');
setCreatorCurrentItem(parkingSpot);

// Now click on the stage to create items
```

### Aligning Items

```typescript
const {
  setStageMode,
  setXAlignment,
  setYAlignment,
  setAlignmentInCols,
  spreadItemsByCircle,
} = planorama;

// Switch to select mode
setStageMode('select');

// Select items by dragging or clicking

// Align horizontally with 15px gap
setXAlignment(15);

// Align vertically with 20px gap
setYAlignment(20);

// Align in 4 columns with 10px gap
setAlignmentInCols(4, 10);

// Spread in a circle
spreadItemsByCircle({
  radius: 500,
  withRotation: 'outside',
});
```

### Rotating Items

```typescript
const { setRotationAngle, setRotation } = planorama;

// Set default rotation
setRotationAngle(45);

// Rotate selected items by default angle
setRotation();

// Or rotate by specific angle
setRotation(90);
```

### Updating Items

```typescript
const { updateItemById } = planorama;

// Update item by ID
updateItemById('item-abc123', {
  background: {
    backgroundColor: '#ffff00',
    strokeColor: '#ff0000',
    strokeWidth: 3,
  },
  label: {
    text: 'Spot A-1',
    fontSize: 22,
    fillColor: '#000',
  },
});
```

### Exporting Items

```typescript
const { exportAllItems } = planorama;

// Export all items to console
exportAllItems((items) => {
  console.log('Total items:', items.length);
  items.forEach((item) => {
    console.log(`${item.type} (${item.id}):`, item.transform);
  });
});

// Save items to local storage
exportAllItems((items) => {
  const json = JSON.stringify(items, null, 2);
  localStorage.setItem('my-planorama', json);
});

// Download items as JSON file
exportAllItems((items) => {
  const exportData = items.map((item) => ({
    id: item.id,
    type: item.type,
    position: { x: item.transform.x, y: item.transform.y },
    rotation: item.transform.rotation,
    label: item.itemProps.label?.text,
  }));

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'planorama-export.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Generate report by item type
exportAllItems((items) => {
  const report = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('Items by type:', report);
});
```

### Fitting All Items on Screen

```typescript
const { centerOnItems, exportAllItems } = planorama;

// After loading or importing items, fit them all on screen
exportAllItems((items) => {
  console.log(`Loaded ${items.length} items`);
  // Automatically zoom and pan to fit all items
  centerOnItems();
});

// Add a "Fit All" button to your UI
fitAllButton.addEventListener('click', () => {
  centerOnItems();
});

// Reset view after bulk operations
const { setAlignmentInCols, centerOnItems } = planorama;

// Align items in a grid
setAlignmentInCols(5, 20);

// Then fit them on screen
setTimeout(() => {
  centerOnItems();
}, 100);
```

### Keyboard Shortcuts

```typescript
const { discardSelection, deleteSelectedItems, cloneSelectedItems } = planorama;

container.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    discardSelection();
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    deleteSelectedItems();
  }

  if (e.ctrlKey && e.key === 'd') {
    e.preventDefault();
    cloneSelectedItems();
  }
});
```

---

## License

MIT
