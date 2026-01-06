import { useState } from 'react';

import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import type { ItemConfig, PlanoramaItem, RotationMode } from '@maciejwegrzynek/planorama';

import type { UsePlanoramaReturn } from '../../hooks/usePlanorama';

interface SidebarProps {
  planorama: UsePlanoramaReturn;
  isReady: boolean;
  itemsConfig: ItemConfig[];
  onCreateMode: (itemConfig: ItemConfig) => void;
  currentItemType: ItemConfig | null;
}

const DRAWER_WIDTH = 280;

export function Sidebar({ planorama, isReady, itemsConfig, onCreateMode, currentItemType }: SidebarProps) {
  const [gap, setGap] = useState(10);
  const [cols, setCols] = useState(3);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [circleRotation, setCircleRotation] = useState<RotationMode>('outside');
  const [radius, setRadius] = useState(500);

  const {
    setXAlignment,
    setYAlignment,
    setAlignmentInCols,
    spreadItemsByCircle,
    setRotation,
    cloneSelectedItems,
    exportAllItems,
    importItems,
    selectedItems,
  } = planorama;

  const handleExport = () => {
    exportAllItems((items: PlanoramaItem[]) => {
      const json = JSON.stringify(items, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'planorama-export.json';
      a.click();
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const items = JSON.parse(event.target?.result as string);
            importItems(items);
          } catch (error) {
            console.error('Failed to import:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          position: 'relative',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Alignment Options
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Gap"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Columns"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Rotate (degrees)"
            value={rotateAngle}
            onChange={(e) => setRotateAngle(Number(e.target.value))}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setXAlignment(gap)}
            disabled={!isReady || selectedItems.length < 2}
          >
            Align X
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setYAlignment(gap)}
            disabled={!isReady || selectedItems.length < 2}
          >
            Align Y
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setAlignmentInCols(cols, gap)}
            disabled={!isReady || selectedItems.length < 2}
          >
            Align in Cols
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setRotation(rotateAngle)}
            disabled={!isReady || selectedItems.length === 0}
          >
            Rotate
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => cloneSelectedItems()}
            disabled={!isReady || selectedItems.length === 0}
          >
            Clone Selected
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Circle Spread
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel>Rotation</InputLabel>
            <Select
              value={circleRotation || 'none'}
              label="Rotation"
              onChange={(e) => setCircleRotation(e.target.value === 'none' ? null : (e.target.value as RotationMode))}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="outside">Outside</MenuItem>
              <MenuItem value="inside">Inside</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            type="number"
            label="Radius"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={() =>
            spreadItemsByCircle({
              radius,
              withRotation: circleRotation,
            })
          }
          disabled={!isReady || selectedItems.length < 2}
          sx={{ mb: 2 }}
        >
          Spread by Circle
        </Button>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Item Types
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {itemsConfig.map((item) => (
            <Button
              key={item.name}
              fullWidth
              variant="contained"
              size="small"
              onClick={() => onCreateMode(item)}
              disabled={!isReady}
              color={currentItemType?.name === item.name ? 'secondary' : 'primary'}
            >
              {item.name}
            </Button>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!isReady}
          >
            Export
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="small"
            color="info"
            startIcon={<UploadIcon />}
            onClick={handleImport}
            disabled={!isReady}
          >
            Import
          </Button>
        </Box>
        <Box>
          <img src="/computer.svg" alt="Computer" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Box>
    </Drawer>
  );
}
