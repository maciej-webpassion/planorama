import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getOnTransformChange,
  getOnTransformEnd,
  getOnTransformStart,
  getSpreadByOpts,
  setOnTransformChange,
  setOnTransformEnd,
  setOnTransformStart,
  setSpreadByOpts,
  spreadByOpts,
} from '@/core/state/selection-state';

describe('Selection State', () => {
  beforeEach(() => {
    // Reset to default values
    setSpreadByOpts({
      withRotation: null,
      radius: 500,
    });
  });

  describe('spreadByOpts', () => {
    it('should have default values', () => {
      const opts = getSpreadByOpts();
      expect(opts.withRotation).toBeNull();
      expect(opts.radius).toBe(500);
    });

    it('should get and set spread options', () => {
      const newOpts = {
        withRotation: 'clockwise' as const,
        radius: 300,
      };

      setSpreadByOpts(newOpts);

      expect(getSpreadByOpts()).toEqual(newOpts);
      expect(spreadByOpts.value).toEqual(newOpts);
    });

    it('should handle counter-clockwise rotation', () => {
      const opts = {
        withRotation: 'counter-clockwise' as const,
        radius: 400,
      };

      setSpreadByOpts(opts);

      expect(getSpreadByOpts().withRotation).toBe('counter-clockwise');
    });

    it('should handle no rotation', () => {
      const opts = {
        withRotation: null,
        radius: 600,
      };

      setSpreadByOpts(opts);

      expect(getSpreadByOpts().withRotation).toBeNull();
      expect(getSpreadByOpts().radius).toBe(600);
    });

    it('should update radius independently', () => {
      const opts = getSpreadByOpts();
      const newOpts = {
        ...opts,
        radius: 250,
      };

      setSpreadByOpts(newOpts);

      expect(getSpreadByOpts().radius).toBe(250);
    });
  });

  describe('transform callbacks', () => {
    describe('onTransformChange', () => {
      it('should set and get transform change callback', () => {
        const callback = vi.fn();
        setOnTransformChange(callback);

        const retrievedCallback = getOnTransformChange();
        retrievedCallback({ test: 'data' });

        expect(callback).toHaveBeenCalledWith({ test: 'data' });
      });

      it('should replace previous callback', () => {
        const callback1 = vi.fn();
        const callback2 = vi.fn();

        setOnTransformChange(callback1);
        setOnTransformChange(callback2);

        const retrievedCallback = getOnTransformChange();
        retrievedCallback({ test: 'data' });

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalledWith({ test: 'data' });
      });
    });

    describe('onTransformEnd', () => {
      it('should set and get transform end callback', () => {
        const callback = vi.fn();
        setOnTransformEnd(callback);

        const retrievedCallback = getOnTransformEnd();
        retrievedCallback({ test: 'data' });

        expect(callback).toHaveBeenCalledWith({ test: 'data' });
      });

      it('should handle multiple invocations', () => {
        const callback = vi.fn();
        setOnTransformEnd(callback);

        const retrievedCallback = getOnTransformEnd();
        retrievedCallback({ first: 'call' });
        retrievedCallback({ second: 'call' });

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenNthCalledWith(1, { first: 'call' });
        expect(callback).toHaveBeenNthCalledWith(2, { second: 'call' });
      });
    });

    describe('onTransformStart', () => {
      it('should set and get transform start callback', () => {
        const callback = vi.fn();
        setOnTransformStart(callback);

        const retrievedCallback = getOnTransformStart();
        retrievedCallback({ test: 'data' });

        expect(callback).toHaveBeenCalledWith({ test: 'data' });
      });

      it('should work with all three callbacks together', () => {
        const startCallback = vi.fn();
        const changeCallback = vi.fn();
        const endCallback = vi.fn();

        setOnTransformStart(startCallback);
        setOnTransformChange(changeCallback);
        setOnTransformEnd(endCallback);

        getOnTransformStart()({ start: true });
        getOnTransformChange()({ changing: true });
        getOnTransformEnd()({ end: true });

        expect(startCallback).toHaveBeenCalledWith({ start: true });
        expect(changeCallback).toHaveBeenCalledWith({ changing: true });
        expect(endCallback).toHaveBeenCalledWith({ end: true });
      });
    });
  });
});
