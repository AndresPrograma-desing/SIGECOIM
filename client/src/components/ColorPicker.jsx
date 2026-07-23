import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, FormControl, FormLabel } from '@mui/material';
import { Check } from 'lucide-react';

const PREDEFINED_COLORS = [
  { name: 'Marrón Madera', hex: '#8B4513' },
  { name: 'Madera Clara', hex: '#D2B48C' },
  { name: 'Madera Oscura', hex: '#3e2723' },
  { name: 'Negro', hex: '#000000' },
  { name: 'Dorado', hex: '#D4AF37' },
  { name: 'Plateado', hex: '#C0C0C0' },
  { name: 'Rojo Lacado', hex: '#B22222' },
  { name: 'Azul Lacado', hex: '#4682B4' },
  { name: 'Blanco', hex: '#FFFFFF' },
];

const ColorPicker = ({ value, onChange }) => {
  // Parsear el valor "Nombre|Hex" recibido del padre
  let parsedName = 'Marrón Madera';
  let parsedHex = '#8B4513';
  let isCustomVal = false;

  if (value && value.includes('|')) {
    const parts = value.split('|');
    parsedName = parts[0];
    parsedHex = parts[1];
    isCustomVal = !PREDEFINED_COLORS.some(
      (c) => c.hex.toLowerCase() === parsedHex.toLowerCase() && c.name.toLowerCase() === parsedName.toLowerCase()
    );
  } else if (value) {
    parsedName = value;
    isCustomVal = true;
    parsedHex = '#000000';
  }

  // Estados locales para la entrada personalizada
  // Esto evita enviar actualizaciones de estado al padre continuamente mientras arrastra el color picker
  const [customName, setCustomName] = useState(isCustomVal ? parsedName : '');
  const [customHex, setCustomHex] = useState(isCustomVal ? parsedHex : '#000000');
  const [activeTab, setActiveTab] = useState(isCustomVal ? 'custom' : 'predefined');

  // Sincronizar desde el padre (por ejemplo, al cargar para editar)
  useEffect(() => {
    if (isCustomVal) {
      setCustomName(parsedName);
      setCustomHex(parsedHex);
      setActiveTab('custom');
    } else {
      setActiveTab('predefined');
    }
  }, [value]);

  const handleSelectPredefined = (color) => {
    setActiveTab('predefined');
    if (onChange) {
      onChange({
        target: {
          name: 'color',
          value: `${color.name}|${color.hex}`,
        },
      });
    }
  };

  const handleCustomColorChange = (hex) => {
    setCustomHex(hex);
    setActiveTab('custom');
    // Si el nombre anterior era predefinido, lo reseteamos a "Personalizado"
    let name = customName;
    const wasPredefined = PREDEFINED_COLORS.some(c => c.name === name);
    if (wasPredefined || !name.trim()) {
      name = 'Personalizado';
      setCustomName(name);
    }
    
    if (onChange) {
      onChange({
        target: {
          name: 'color',
          value: `${name}|${hex}`,
        },
      });
    }
  };

  const handleCustomNameChange = (name) => {
    setCustomName(name);
    setActiveTab('custom');
    if (onChange) {
      onChange({
        target: {
          name: 'color',
          value: `${name || 'Personalizado'}|${customHex}`,
        },
      });
    }
  };

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" sx={{ mb: 1.5, fontSize: '0.85rem', fontWeight: '500', color: 'text.secondary' }}>
        Color del Instrumento
      </FormLabel>

      {/* Paleta de colores rápidos */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
        {PREDEFINED_COLORS.map((color) => {
          const isSelected = activeTab === 'predefined' && parsedHex.toLowerCase() === color.hex.toLowerCase();
          return (
            <Box
              key={color.name}
              title={color.name}
              onClick={() => handleSelectPredefined(color)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: color.hex,
                border: isSelected ? '2px solid' : '1px solid',
                borderColor: isSelected ? 'primary.main' : (color.hex === '#ffffff' ? '#cbd5e1' : 'transparent'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 0 2px rgba(25, 118, 210, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.1s ease',
                '&:hover': {
                  transform: 'scale(1.08)',
                },
              }}
            >
              {isSelected && (
                <Check
                  size={16}
                  color={color.hex === '#FFFFFF' || color.hex === '#D2B48C' || color.hex === '#C0C0C0' ? '#000000' : '#FFFFFF'}
                />
              )}
            </Box>
          );
        })}
      </Box>

      {/* Selector Personalizado */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              width: 40,
              height: 40,
              borderRadius: '8px',
              backgroundColor: customHex,
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              border: activeTab === 'custom' ? '2px solid' : 'none',
              borderColor: 'primary.main',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <input
              type="color"
              value={customHex}
              // Usamos onInput para cambiar el estado local de forma fluida (sin lag)
              onInput={(e) => setCustomHex(e.target.value)}
              // Usamos onChange para impactar al padre sólo cuando el usuario suelta el selector (evita saturar React)
              onChange={(e) => handleCustomColorChange(e.target.value)}
              style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                width: '56px',
                height: '56px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: 'none',
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.68rem' }}>
            Personalizado
          </Typography>
        </Box>

        <TextField
          label="Nombre de Color Personalizado"
          variant="outlined"
          size="small"
          fullWidth
          value={activeTab === 'custom' ? customName : ''}
          onChange={(e) => handleCustomNameChange(e.target.value)}
          placeholder="Ej: Madera Roja"
          onClick={() => {
            if (activeTab !== 'custom') {
              setActiveTab('custom');
              const name = customName || 'Personalizado';
              setCustomName(name);
              handleCustomNameChange(name);
            }
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
    </FormControl>
  );
};

export default ColorPicker;
