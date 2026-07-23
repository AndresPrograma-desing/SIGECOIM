import React from 'react';
import { Drawer, Box, Typography, IconButton, Divider, Button } from '@mui/material';
import { X } from 'lucide-react';
import { surface, shadow } from '../theme/colors';

const DrawPanel = ({ open, onClose, title, onSubmit, width = 500, children }) => {
  const formattedWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: formattedWidth,
          minWidth: formattedWidth, // Bloqueo estricto inferior
          maxWidth: formattedWidth, // Bloqueo estricto superior para evitar estiramiento
          boxSizing: 'border-box',
          backgroundColor: surface.paper,
          boxShadow: shadow.elevated,
        },
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Cabecera con su propio padding */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 4, height: 26, borderRadius: 999, backgroundColor: 'secondary.main' }} />
            <Typography variant="h5">{title}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <X size={24} />
          </IconButton>
        </Box>

        <Divider />

        {/* Contenido (Scrollable) */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </Box>

        <Divider />

        {/* Pie de página con botones */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 3, backgroundColor: 'background.default' }}>
          <Button onClick={onClose} variant="outlined" color="inherit" size="large">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large">
            Guardar
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DrawPanel;