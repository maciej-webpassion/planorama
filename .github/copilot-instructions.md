# Copilot Instructions

This project is a TypeScript NPM library that allows users to create and manage 2D plans like parkings, gardens, playgrounds, and more. The application is built using TypeScript and Konva.js for canvas-based 2D rendering, with state management powered by @preact/signals-core.

## Project Overview

**Tech Stack:**

- **TypeScript** (5.8.3) with strict mode enabled
- **Konva.js** (9.3.22) - HTML5 Canvas library for 2D rendering
- **@preact/signals-core** (1.12.1) - Reactive state management
- **lodash-es** (4.17.21) - Utility functions
- **Vite** - Build tool and development server

**Project Structure:**

- `src/core/` - Core library functionality
  - `config/` - Configuration constants and settings
  - `services/` - Business logic and features (stage, viewport, background, items, calculations)
  - `store/` - State management using signals (event-bus, stage, item, select, creator)
- `src/ui/` - UI-related components
- `public/assets/` - Static assets (SVG icons, images)

## Architecture Patterns

### State Management

- Use **@preact/signals-core** for reactive state management
- Organize state in `src/core/store/` directory by feature (stage, item, select, creator)
- Each store module should export:
  - Signal instances (e.g., `export const mode: Signal<StageMode>`)
  - Getter functions with `get` prefix (e.g., `getModeValue()`)
  - Setter functions with `set` prefix (e.g., `setModeValue()`)
  - Use `batch()` for multiple state updates
- Example pattern:

  ```typescript
  import { Signal, signal, batch } from '@preact/signals-core';

  export const myState: Signal<MyType> = signal(initialValue);
  export const getMyState = (): MyType => myState.value;
  export const setMyState = (value: MyType) => {
    myState.value = value;
  };
  ```

### Event Bus Pattern

- Use custom event bus in `src/core/store/event-bus/`
- Define all event types in `PlanoramaEvent` type union
- Use `emit()` to dispatch events and `on()` to subscribe
- Example:

  ```typescript
  import { emit, on } from '../store/event-bus';

  emit('select:action:alignX', payload);
  on('select:action:alignX', (payload) => {
    /* handler */
  });
  ```

### Konva.js Integration

- Import specific Konva classes from their direct paths (tree-shakeable):
  ```typescript
  import { Stage } from 'konva/lib/Stage';
  import { Layer } from 'konva/lib/Layer';
  import { Group } from 'konva/lib/Group';
  ```
- Avoid importing from 'konva' directly
- Use Konva's naming system for tracking objects (e.g., `ITEM_NAME`, `STAGE_NAME`)
- All Konva object names should use 'planorama-' prefix

### Configuration Constants

- Define all constants in `src/core/config/config.const.ts`
- Use UPPER_SNAKE_CASE for constant names
- Group related constants together
- Export configuration objects for complex settings (e.g., `TRANSFORM_ANIMATION_SETTINGS`)

## Coding Standards

### General TypeScript

- Use **strict TypeScript mode** - all strict flags enabled
- Enable `noUnusedLocals` and `noUnusedParameters`
- Use camelCase for variable and function names
- Use PascalCase for type, interface, and class names
- Use UPPER_SNAKE_CASE for constants
- Use single quotes for strings
- Use 2 spaces for indentation
- Prefer `const` over `let`; avoid `var`
- Use destructuring for objects and arrays
- Use template literals for strings containing variables
- Use arrow functions for callbacks and function expressions
- Target ES2020 features

### Type Definitions

- Always define explicit types for function parameters and return types
- Use interfaces for object shapes and data structures
- Use type aliases for unions, intersections, and complex types
- Prefer `interface` over `type` for object definitions
- Export types and interfaces when they're shared across modules
- Example:
  ```typescript
  export interface ItemConfig {
    name: string;
    width: number;
    height: number;
    src: string;
    scale: Vector2d;
  }
  ```

### Imports

- Use ES6 module syntax
- Import from specific paths for tree-shaking (especially for lodash-es and Konva)
- Group imports in this order:
  1. External libraries (Konva, signals, lodash)
  2. Internal imports (config, store, services)
  3. Types
- Use `.ts` extension in import paths for local modules
- Example:

  ```typescript
  import { Group } from 'konva/lib/Group';
  import { orderBy } from 'lodash-es';

  import { ITEM_NAME } from '../../config/config.const';
  import { emit } from '../../store/event-bus';
  ```

### Functions

- Use arrow functions for most cases
- Export functions directly when they are standalone utilities
- Prefix with `set`/`get` for state setters/getters
- Add JSDoc comments for complex functions
- Example:
  ```typescript
  /**
   * Align items in columns and rows
   * @param cols Number of columns
   * @param spreadGap Gap between items
   * @param tr Transformer instance
   * @param itemsLayer Layer containing items
   * @param stage Stage instance
   */
  export function alignItemsInCols(
    cols: number,
    spreadGap: number,
    tr: Transformer,
    itemsLayer: Layer,
    stage: Stage
  ) {
    // Implementation
  }
  ```

### Comments

- Use JSDoc comments for exported functions and complex logic
- Use `//` for inline comments
- Keep comments concise and meaningful
- Document parameters, return types, and purpose
- Avoid obvious comments that restate the code

### Performance Considerations

- Use `DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT` constant to determine animation thresholds
- Disable animations for large item counts to maintain performance
- Example pattern:
  ```typescript
  const isWithAnimation =
    animSettings.duration > 0 ||
    nodes.length <= DEFAULT_TRANSFORM_PERFORMANCE_ITEMS_LIMIT;
  ```
- Use Konva's `getClientRect()` with `relativeTo` parameter for accurate positioning

### Error Handling

- Validate inputs early in functions
- Return early for invalid states
- Use TypeScript's type system to prevent errors at compile time

### Naming Conventions

- **Constants**: `UPPER_SNAKE_CASE` (e.g., `ITEM_NAME`, `ITEMS_LAYER_NAME`)
- **Variables**: `camelCase` (e.g., `stageScale`, `itemsPerRow`)
- **Functions**: `camelCase` (e.g., `alignItemsInCols`, `getScaleValue`)
- **Types/Interfaces**: `PascalCase` (e.g., `StageMode`, `ItemConfig`)
- **Signal Variables**: `camelCase` with descriptive names (e.g., `stagePosition`, `mode`)
- **Konva Object Names**: Use prefixed constants (e.g., `planorama-item`, `planorama-stage`)

## Best Practices

1. **State Management**: Always use signals for reactive state; avoid local state when shared across components
2. **Event Communication**: Use the event bus for cross-module communication instead of direct dependencies
3. **Type Safety**: Leverage TypeScript's strict mode; define types for all data structures
4. **Performance**: Consider animation performance limits; disable animations for large datasets
5. **Modularity**: Keep services focused on single responsibilities; separate concerns clearly
6. **Tree Shaking**: Import from specific paths (lodash-es individual functions, Konva specific classes)
7. **Calculations**: Group calculation logic in `src/core/services/calc/` organized by feature
8. **Layer Management**: Use proper layer hierarchy (background, items, transform layers)

## Common Patterns

### Creating a New Service

```typescript
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';

export const setMyService = (layer: Layer, stage: Stage) => {
  // Service setup
  // Event listeners
  // Return public API if needed
};
```

### Adding Event Types

Update `PlanoramaEvent` type in `src/core/store/event-bus/index.ts`:

```typescript
type PlanoramaEvent = 'existing:events' | 'my:new:event';
```

### Working with Transformations

- Use `getAbsoluteTransform()` for accurate positioning
- Reset transforms when moving items between layers
- Apply animations conditionally based on performance limits
- Use `TRANSFORM_ANIMATION_SETTINGS` for consistent animation behavior
