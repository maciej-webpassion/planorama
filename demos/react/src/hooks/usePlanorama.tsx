import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ItemConfig,
  ItemUpdatePayload,
  Planorama,
  PlanoramaConfig,
  PlanoramaItem,
  setPlanorama,
  SpreadByOpts,
  StageMode,
  Vector2d,
} from '@maciejwegrzynek/planorama';

/**
 * Configuration for usePlanorama hook
 * Extends PlanoramaConfig but makes stageContainer optional
 * since it's managed by the ref
 */
export interface UsePlanoramaConfig extends Omit<PlanoramaConfig, 'stageContainer'> {
  /** Optional: Provide your own container element */
  stageContainer?: HTMLDivElement;
}

/**
 * Return type for usePlanorama hook
 * Combines the container ref with all Planorama API methods and reactive state
 */
export interface UsePlanoramaReturn extends Omit<Planorama, 'stage'> {
  /** Ref to attach to the container div element */
  containerRef: (node: HTMLDivElement | null) => void;
  /** Whether Planorama is initialized and ready */
  isReady: boolean;
  /** Current stage mode */
  mode: StageMode | null;
  /** Current viewport scale */
  scale: Vector2d | null;
  /** Current viewport position */
  position: Vector2d | null;
  /** Currently selected items */
  selectedItems: PlanoramaItem[];
  /** Get the Konva Stage instance (available after initialization) */
  getStage: () => Planorama['stage'] | null;
}

/**
 * React hook for Planorama library
 *
 * Provides a complete React integration for the Planorama 2D planning library.
 * Handles initialization, cleanup, and exposes all API methods with reactive state.
 *
 * @example
 * ```tsx
 * function PlanningApp() {
 *   const {
 *     containerRef,
 *     isReady,
 *     setStageMode,
 *     setCreatorCurrentItem,
 *     selectedItems,
 *   } = usePlanorama({
 *     itemsConfig: [
 *       {
 *         name: 'parking-spot',
 *         width: 90,
 *         height: 180,
 *         src: '/assets/spot.svg',
 *         scale: { x: 1, y: 1 },
 *       },
 *     ],
 *     backgroundConfig: {
 *       src: '/assets/background.svg',
 *       scale: 1.9,
 *     },
 *     onItemMouseClick: (item) => {
 *       console.log('Clicked:', item);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
 *       {isReady && (
 *         <button onClick={() => setStageMode('create')}>
 *           Create Mode
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePlanorama(config: UsePlanoramaConfig): UsePlanoramaReturn {
  const planoramaRef = useRef<Planorama | null>(null);
  const stageRef = useRef<Planorama['stage'] | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [mode, setMode] = useState<StageMode | null>(null);
  const [scale, setScale] = useState<Vector2d | null>(null);
  const [position, setPosition] = useState<Vector2d | null>(null);
  const [selectedItems, setSelectedItems] = useState<PlanoramaItem[]>([]);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);

  // Callback ref to capture the container element when it's mounted
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContainerElement(node);
    }
  }, []);

  // Initialize Planorama
  useEffect(() => {
    const container = config.stageContainer || containerElement;

    if (!container) {
      return; // Wait for container to be available
    }

    try {
      // Wrap callbacks to update React state
      const planoramaConfig: PlanoramaConfig = {
        ...config,
        stageContainer: container,
        onViewportChange: (data: { scale: Vector2d; position: Vector2d }) => {
          setScale(data.scale);
          setPosition(data.position);
          config.onViewportChange?.(data);
        },
        onViewModeChange: (newMode: StageMode) => {
          setMode(newMode);
          config.onViewModeChange?.(newMode);
        },
        onItemsSelected: (items: PlanoramaItem[]) => {
          setSelectedItems(items);
          config.onItemsSelected?.(items);
        },
        debug: false,
      };

      const instance = setPlanorama(planoramaConfig);

      planoramaRef.current = instance;
      stageRef.current = instance.stage;

      // Defer state update to avoid synchronous setState in effect
      queueMicrotask(() => {
        setIsReady(true);
      });

      // Set initial mode if provided
      if (config.onViewModeChange) {
        // Mode will be set by the library's initial state
      }
    } catch (error) {
      console.error('usePlanorama: Failed to initialize:', error);
      queueMicrotask(() => {
        setIsReady(false);
      });
    }

    // Cleanup
    return () => {
      if (planoramaRef.current?.stage) {
        planoramaRef.current.stage.destroy();
      }
      planoramaRef.current = null;
      stageRef.current = null;
      setIsReady(false);
      setMode(null);
      setScale(null);
      setPosition(null);
      setSelectedItems([]);
    };
  }, [containerElement]); // Re-run when container is available

  // Wrapped API methods that ensure instance is ready
  const setStageScale = useCallback((newScale: Vector2d) => {
    planoramaRef.current?.setStageScale(newScale);
  }, []);

  const setStagePosition = useCallback((newPosition: Vector2d) => {
    planoramaRef.current?.setStagePosition(newPosition);
  }, []);

  const centerStageOnObjectById = useCallback((id: string) => {
    planoramaRef.current?.centerStageOnObjectById(id);
  }, []);

  const centerOnItems = useCallback((duration?: number) => {
    planoramaRef.current?.centerOnItems(duration);
  }, []);

  const setStageMode = useCallback((newMode: StageMode) => {
    planoramaRef.current?.setStageMode(newMode);
    setMode(newMode);
  }, []);

  const setXAlignment = useCallback((gap?: number) => {
    planoramaRef.current?.setXAlignment(gap);
  }, []);

  const setYAlignment = useCallback((gap?: number) => {
    planoramaRef.current?.setYAlignment(gap);
  }, []);

  const setAlignmentInCols = useCallback((cols?: number, gap?: number) => {
    planoramaRef.current?.setAlignmentInCols(cols, gap);
  }, []);

  const spreadItemsByCircle = useCallback((spreadOpts?: SpreadByOpts) => {
    planoramaRef.current?.spreadItemsByCircle(spreadOpts);
  }, []);

  const setSpreadByOpts = useCallback((opts: SpreadByOpts) => {
    planoramaRef.current?.setSpreadByOpts(opts);
  }, []);

  const setCreatorCurrentItem = useCallback((itemConfig: ItemConfig) => {
    planoramaRef.current?.setCreatorCurrentItem(itemConfig);
  }, []);

  const setRotation = useCallback((rotationAngle?: number) => {
    planoramaRef.current?.setRotation(rotationAngle);
  }, []);

  const setRotationAngle = useCallback((angle: number) => {
    planoramaRef.current?.setRotationAngle(angle);
  }, []);

  const setGap = useCallback((gap: number) => {
    planoramaRef.current?.setGap(gap);
  }, []);

  const setColumns = useCallback((cols: number) => {
    planoramaRef.current?.setColumns(cols);
  }, []);

  const discardSelection = useCallback(() => {
    planoramaRef.current?.discardSelection();
  }, []);

  const deleteSelectedItems = useCallback(() => {
    planoramaRef.current?.deleteSelectedItems();
  }, []);

  const cloneSelectedItems = useCallback(() => {
    planoramaRef.current?.cloneSelectedItems();
  }, []);

  const updateItemById = useCallback((itemId: string, updates: ItemUpdatePayload) => {
    planoramaRef.current?.updateItemById(itemId, updates);
  }, []);

  const selectItemsById = useCallback((ids: string[] | string) => {
    planoramaRef.current?.selectItemsById(ids);
  }, []);

  const exportAllItems = useCallback((callback: (items: PlanoramaItem[]) => void) => {
    planoramaRef.current?.exportAllItems(callback);
  }, []);

  const importItems = useCallback((items: PlanoramaItem[]) => {
    planoramaRef.current?.importItems(items);
  }, []);

  const getStage = useCallback(() => {
    return stageRef.current;
  }, []);

  return {
    // Container ref to attach to div (callback ref ensures we know when it's mounted)
    containerRef,

    // Reactive state
    isReady,
    mode,
    scale,
    position,
    selectedItems,
    getStage,

    // Stage management
    setStageScale,
    setStagePosition,
    centerStageOnObjectById,
    centerOnItems,
    setStageMode,

    // Item alignment
    setXAlignment,
    setYAlignment,
    setAlignmentInCols,
    spreadItemsByCircle,
    setSpreadByOpts,

    // Item creation
    setCreatorCurrentItem,

    // Item manipulation
    setRotation,
    setRotationAngle,
    setGap,
    setColumns,
    discardSelection,
    deleteSelectedItems,
    cloneSelectedItems,
    updateItemById,
    selectItemsById,
    exportAllItems,
    importItems,
  };
}
