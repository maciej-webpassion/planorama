# Planorama Tests

This directory contains all tests for the Planorama library using Vitest.

## Directory Structure

```
tests/
├── setup.ts                    # Global test setup
├── helpers/                    # Test helper utilities
│   ├── konva-mocks.ts         # Konva object factories
│   ├── signal-helpers.ts      # Signal utilities
│   └── test-utils.ts          # General test utilities
├── unit/                       # Unit tests
│   ├── state/                 # State management tests
│   ├── utils/                 # Utility function tests
│   ├── config/                # Configuration tests
│   └── features/              # Feature tests
│       ├── items/
│       ├── selection/
│       │   ├── alignment/
│       │   └── transform/
│       └── stage/
└── integration/               # Integration tests
    └── stage-initialization.test.ts
```

## Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Writing Tests

### Unit Tests

Unit tests should test individual functions or modules in isolation:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/core/utils/my-module';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### State Tests

Test signal-based state management:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { mySignal, getMyValue, setMyValue } from '@/core/state/my-state';

describe('My State', () => {
  beforeEach(() => {
    setMyValue(defaultValue);
  });

  it('should update value', () => {
    setMyValue(newValue);
    expect(getMyValue()).toBe(newValue);
  });
});
```

### Konva Tests

Test Konva-based functionality with mocks:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createMockStage,
  createMockLayer,
  cleanupStage,
} from '@tests/helpers/konva-mocks';

describe('My Feature', () => {
  let stage: Stage;
  let layer: Layer;

  beforeEach(() => {
    stage = createMockStage();
    layer = createMockLayer();
    stage.add(layer);
  });

  afterEach(() => {
    cleanupStage(stage);
  });

  it('should work with stage', () => {
    // Test implementation
  });
});
```

## Test Helpers

### Konva Mocks

- `createMockStage(config?)` - Create a test Stage
- `createMockLayer(config?)` - Create a test Layer
- `createMockGroup(config?)` - Create a test Group
- `createMockTransformer(config?)` - Create a test Transformer
- `cleanupStage(stage)` - Clean up stage after test

### Signal Helpers

- `resetSignal(signal, defaultValue)` - Reset single signal
- `resetSignals(...[signal, value])` - Reset multiple signals
- `getSignalSnapshot(signal)` - Get immutable snapshot
- `waitForSignalValue(signal, expected)` - Wait for signal change

### Test Utils

- `compareVectors(v1, v2, tolerance?)` - Compare Vector2d with tolerance
- `compareNumbers(n1, n2, tolerance?)` - Compare numbers with tolerance
- `createMockImage(width?, height?)` - Create mock image element
- `waitFor(condition, timeout?)` - Wait for condition

## Coverage Goals

- **State modules**: 90-100% (pure logic)
- **Utils**: 85-95% (pure functions)
- **Features**: 70-85% (Konva integration)
- **Overall**: 80%+

## Best Practices

1. **Always cleanup** - Use `afterEach` to clean up Konva stages
2. **Reset state** - Use `beforeEach` to reset signals to defaults
3. **Test isolation** - Each test should be independent
4. **Descriptive names** - Use clear, descriptive test names
5. **Arrange-Act-Assert** - Follow AAA pattern
6. **Mock external dependencies** - Don't rely on real browser APIs
7. **Test edge cases** - Include boundary conditions and error cases

## CI/CD Integration

Tests run automatically on:

- Pull requests
- Push to main branch
- Pre-commit hooks (optional)

## Debugging Tests

```bash
# Run specific test file
npm test -- align-x.test.ts

# Run tests matching pattern
npm test -- --grep "alignment"

# Debug in VS Code
# Set breakpoint and use "Debug Test" in VS Code
```

## Troubleshooting

### Canvas context errors

If you see canvas-related errors, check that `tests/setup.ts` is properly mocking the canvas context.

### Signal not updating

Ensure you're using the getter functions (`getMyValue()`) rather than accessing `.value` directly in tests.

### Stage cleanup warnings

Always call `cleanupStage(stage)` in `afterEach` to prevent memory leaks and DOM pollution.
