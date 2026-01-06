import { Box, Paper, Typography } from '@mui/material';

import type { PlanoramaItem, StageMode, Vector2d } from '@maciejwegrzynek/planorama';

interface StatusBarProps {
  mode: StageMode | null;
  scale: Vector2d | null;
  position: Vector2d | null;
  selectedItems: PlanoramaItem[];
  clickedItem: PlanoramaItem | null;
}

export function StatusBar({ mode, scale, position, selectedItems, clickedItem }: StatusBarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        px: 2,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        gap: 3,
        fontSize: '0.875rem',
        bgcolor: 'grey.50',
      }}
    >
      <Box>
        <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>
          Mode:
        </Typography>
        {mode || 'N/A'}
      </Box>
      <Box>
        <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>
          Zoom:
        </Typography>
        {scale ? `${Math.round(scale.x * 100)}%` : 'N/A'}
      </Box>
      <Box>
        <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>
          Position:
        </Typography>
        {position ? `${Math.round(position.x)}, ${Math.round(position.y)}` : 'N/A'}
      </Box>
      <Box>
        <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>
          Selected:
        </Typography>
        {selectedItems.length} item(s)
      </Box>
      {clickedItem && (
        <Box>
          <Typography component="span" fontWeight="bold" sx={{ mr: 1 }}>
            Last Clicked:
          </Typography>
          {clickedItem.type} ({clickedItem.id.slice(0, 8)}...)
        </Box>
      )}
    </Paper>
  );
}
