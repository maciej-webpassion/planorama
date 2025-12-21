# Update Item by ID Feature

The `updateItemById` feature allows you to dynamically update item properties after they have been created on the stage.

## Usage

```typescript
import { setStage } from './core/services/stage';

// Initialize the stage
const planorama = setStage({
  stageContainer: document.querySelector('#planorama-stage')!,
  // ... other config options
});

// Update an item by its ID
planorama.updateItemById('item-123456', {
  background: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',  // Red background
    strokeColor: 'rgba(255, 0, 0, 0.8)',      // Red border
    strokeWidth: 2
  },
  label: {
    text: 'Updated Label',
    fontSize: 24,
    fontFamily: 'Arial',
    fillColor: '#000000',
    verticalAlignment: 50,   // 50% from top (center)
    horizontalAlignment: 50  // 50% from left (center)
  }
});
```

## API Reference

### `planorama.updateItemById(itemId: string, updates: ItemUpdatePayload)`

Updates an existing item's properties by its unique ID.

**Parameters:**

- `itemId` (string): The unique identifier of the item to update (e.g., 'item-abc123')
- `updates` (ItemUpdatePayload): Object containing properties to update

### ItemUpdatePayload Interface

```typescript
interface ItemUpdatePayload {
  id: string;
  background?: {
    backgroundColor?: string;  // RGBA or hex color
    strokeColor?: string;      // RGBA or hex color
    strokeWidth?: number;      // Border width in pixels
  };
  label?: {
    text?: string;             // Label text content
    fontSize?: number;         // Font size in pixels
    fontFamily?: string;       // Font family name
    fillColor?: string;        // Text color (RGBA or hex)
    verticalAlignment?: number;   // 0-100 (percentage from top)
    horizontalAlignment?: number; // 0-100 (percentage from left)
  };
}
```

## Updatable Properties

### Background Properties

- **backgroundColor**: Change the fill color (supports RGBA and hex formats)
- **strokeColor**: Change the border color (supports RGBA and hex formats)
- **strokeWidth**: Adjust the border width in pixels

### Label Properties

- **text**: Update the displayed text
- **fontSize**: Change the font size in pixels
- **fontFamily**: Change the font (e.g., 'Arial', 'Helvetica', 'Times New Roman')
- **fillColor**: Change the text color (supports RGBA and hex formats)
- **verticalAlignment**: Position label vertically (0 = top, 50 = center, 100 = bottom)
- **horizontalAlignment**: Position label horizontally (0 = left, 50 = center, 100 = right)

## Examples

### Update Only Background Color

```typescript
planorama.updateItemById('item-123', {
  background: {
    backgroundColor: '#00ff00' // Green
  }
});
```

### Update Only Label Text and Size

```typescript
planorama.updateItemById('item-123', {
  label: {
    text: 'New Text',
    fontSize: 20
  }
});
```

### Update Label Position

```typescript
planorama.updateItemById('item-123', {
  label: {
    verticalAlignment: 10,    // Near top
    horizontalAlignment: 90   // Near right
  }
});
```

### Full Update

```typescript
planorama.updateItemById('item-parking-spot-1', {
  background: {
    backgroundColor: 'rgba(100, 200, 100, 0.5)',
    strokeColor: 'rgba(100, 200, 100, 0.9)',
    strokeWidth: 3
  },
  label: {
    text: 'A-123',
    fontSize: 22,
    fontFamily: 'Helvetica',
    fillColor: '#003300',
    verticalAlignment: 50,
    horizontalAlignment: 50
  }
});
```

## Getting Item IDs

Item IDs are automatically generated when items are created. They follow the format `item-{uuid}`. You can access item IDs through:

1. **onItemMouseClick callback**: The item ID is included in the callback data
2. **onItemsSelected callback**: Selected items include their IDs

Example:

```typescript
const planorama = setStage({
  stageContainer: document.querySelector('#planorama-stage')!,
  onItemMouseClick: (data) => {
    console.log('Clicked item ID:', data.id);
    // Now you can update this item
    planorama.updateItemById(data.id, {
      background: { backgroundColor: '#ff0000' }
    });
  }
});
```

## Notes

- All update properties are optional - you can update only the properties you need
- If an item with the specified ID doesn't exist, a warning will be logged to the console
- Updates are immediate and the canvas will be redrawn automatically
- Label repositioning is automatically calculated when alignment values change
