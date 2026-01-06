import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import PanToolIcon from '@mui/icons-material/PanTool';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar as MuiToolbar,
  Tooltip,
} from '@mui/material';

import type { ItemConfig, StageMode } from '@maciejwegrzynek/planorama';

import type { UsePlanoramaReturn } from '../../hooks/usePlanorama';

interface ToolbarProps {
  planorama: UsePlanoramaReturn;
  isReady: boolean;
  mode: StageMode | null;
  currentItemType: ItemConfig | null;
  itemsConfig: ItemConfig[];
  onCreateMode: (itemConfig: ItemConfig) => void;
}

export function Toolbar({ planorama, isReady, mode, currentItemType, itemsConfig, onCreateMode }: ToolbarProps) {
  const {
    setStageMode,
    setStageScale,
    centerOnItems,
    scale,
    selectedItems,
    deleteSelectedItems,
    cloneSelectedItems,
    setRotation,
  } = planorama;

  const handleModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: StageMode | null) => {
    if (newMode !== null) {
      setStageMode(newMode);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <MuiToolbar variant="dense" sx={{ gap: 1 }}>
        {/* Mode Controls */}
        <ToggleButtonGroup size="small" value={mode} exclusive onChange={handleModeChange} disabled={!isReady}>
          <ToggleButton value="viewport">
            <Tooltip title="Viewport Mode">
              <ViewInArIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="select">
            <Tooltip title="Select Mode">
              <PanToolIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Create Items */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {itemsConfig.map((item) => (
            <Button
              key={item.name}
              size="small"
              variant={mode === 'create' && currentItemType?.name === item.name ? 'contained' : 'outlined'}
              startIcon={<AddIcon />}
              onClick={() => onCreateMode(item)}
              disabled={!isReady}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Zoom Controls */}
        <ButtonGroup size="small" disabled={!isReady}>
          <Tooltip title="Zoom In">
            <IconButton
              size="small"
              onClick={() => scale && setStageScale({ x: scale.x + 0.1, y: scale.y + 0.1 })}
              disabled={!isReady}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton
              size="small"
              onClick={() => scale && setStageScale({ x: scale.x - 0.1, y: scale.y - 0.1 })}
              disabled={!isReady}
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit All">
            <IconButton size="small" onClick={() => centerOnItems()} disabled={!isReady}>
              <ZoomOutMapIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Transform Controls */}
        <ButtonGroup size="small" disabled={!isReady || selectedItems.length === 0}>
          <Tooltip title="Rotate 45°">
            <IconButton size="small" onClick={() => setRotation(45)} disabled={!isReady || selectedItems.length === 0}>
              <RotateRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clone">
            <IconButton
              size="small"
              onClick={() => cloneSelectedItems()}
              disabled={!isReady || selectedItems.length === 0}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => deleteSelectedItems()}
              disabled={!isReady || selectedItems.length === 0}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </MuiToolbar>
    </AppBar>
  );
}
