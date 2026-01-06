import { Box, CircularProgress } from '@mui/material';

interface CanvasProps {
  containerRef: (node: HTMLDivElement | null) => void;
  isReady: boolean;
}

export function Canvas({ containerRef, isReady }: CanvasProps) {
  return (
    <Box
      sx={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#fff',
      }}
    >
      <Box
        id="planorama-container"
        ref={containerRef}
        sx={{
          width: '100%',
          height: '100%',
        }}
      />

      {!isReady && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Box>Loading Planorama...</Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
