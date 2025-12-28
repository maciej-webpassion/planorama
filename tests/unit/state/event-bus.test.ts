import { beforeEach, describe, expect, it, vi } from 'vitest';

import { emit, on } from '@/core/state/event-bus';

describe('Event Bus', () => {
  beforeEach(() => {
    // Clear any lingering effects between tests
    vi.clearAllMocks();
  });

  describe('emit and on', () => {
    it('should emit and receive events', () => {
      const handler = vi.fn();

      on('select:action:alignX', handler);

      const payload = { alignment: 'left' };
      emit('select:action:alignX', payload);

      // Give the effect time to run
      expect(handler).toHaveBeenCalledWith(payload);
    });

    it('should handle different event types', () => {
      const handlerAlignX = vi.fn();
      const handlerAlignY = vi.fn();

      on('select:action:alignX', handlerAlignX);
      on('select:action:alignY', handlerAlignY);

      emit('select:action:alignX', { value: 'left' });

      expect(handlerAlignX).toHaveBeenCalledWith({ value: 'left' });
      expect(handlerAlignY).not.toHaveBeenCalled();
    });

    it('should emit events without payload', () => {
      const handler = vi.fn();

      on('select:action:discardSelection', handler);
      emit('select:action:discardSelection');

      expect(handler).toHaveBeenCalledWith(undefined);
    });

    it('should handle viewport events', () => {
      const handler = vi.fn();

      on('viewport:action:centerOnItem', handler);

      const payload = { itemId: 'item-123' };
      emit('viewport:action:centerOnItem', payload);

      expect(handler).toHaveBeenCalledWith(payload);
    });

    it('should handle item events', () => {
      const handler = vi.fn();

      on('item:action:updateById', handler);

      const payload = { id: 'item-1', config: {} };
      emit('item:action:updateById', payload);

      expect(handler).toHaveBeenCalledWith(payload);
    });

    it('should handle selection transform events', () => {
      const startHandler = vi.fn();
      const changeHandler = vi.fn();
      const endHandler = vi.fn();

      on('select:action:transformStart', startHandler);
      on('select:action:transformChange', changeHandler);
      on('select:action:transformEnd', endHandler);

      emit('select:action:transformStart', { item: 'test' });
      emit('select:action:transformChange', { item: 'test' });
      emit('select:action:transformEnd', { item: 'test' });

      expect(startHandler).toHaveBeenCalled();
      expect(changeHandler).toHaveBeenCalled();
      expect(endHandler).toHaveBeenCalled();
    });
  });
});
