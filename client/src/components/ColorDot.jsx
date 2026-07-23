import React from 'react';
import { Box } from '@mui/material';

const ColorDot = ({ color }) => {
  if (!color) return <span>-</span>;

  // Intentar parsear el formato "Nombre|Hex"
  let name = color;
  let hex = '#cccccc';

  if (color.includes('|')) {
    const parts = color.split('|');
    name = parts[0];
    hex = parts[1];
  } else {
    // Mapa de colores comunes por nombre para compatibilidad
    const lowerName = color.toLowerCase();
    if (lowerName.includes('negro')) hex = '#000000';
    else if (lowerName.includes('marrón') || lowerName.includes('marron') || lowerName.includes('madera')) hex = '#8B4513';
    else if (lowerName.includes('dorado') || lowerName.includes('oro')) hex = '#D4AF37';
    else if (lowerName.includes('plateado') || lowerName.includes('plata')) hex = '#C0C0C0';
    else if (lowerName.includes('blanco')) hex = '#FFFFFF';
    else if (lowerName.includes('rojo')) hex = '#B22222';
    else if (lowerName.includes('azul')) hex = '#4682B4';
  }

  return (
    <Box
      title={name} // Tooltip nativo súper rápido de navegador, previene lag de renderizado
      sx={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        backgroundColor: hex,
        border: '1px solid',
        borderColor: hex === '#ffffff' ? '#cbd5e1' : 'transparent',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer',
        transition: 'transform 0.1s ease',
        '&:hover': {
          transform: 'scale(1.15)',
        }
      }}
    />
  );
};

export default ColorDot;
