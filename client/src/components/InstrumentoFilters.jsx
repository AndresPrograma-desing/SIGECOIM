import React from 'react';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select, IconButton, Tooltip, Paper } from '@mui/material';
// Ajusta el ícono de reinicio según el que estés usando (ej. RotateCcw o RefreshCw de lucide-react)
import { RotateCcw } from 'lucide-react'; 

const InstrumentoFilters = ({ search, setSearch, filterDisponibilidad, setFilterDisponibilidad }) => {
  
  const handleReset = () => {
    setSearch('');
    setFilterDisponibilidad('');
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 3, 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center', 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        flexWrap: 'wrap', // Permite que caigan a la siguiente línea en móviles
        backgroundColor: 'background.paper'
      }}
    >
      {/* Buscador (Toma todo el espacio restante) */}
      <TextField
        label="Buscar por nombre, código, marca o modelo..."
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ flexGrow: 1, minWidth: '250px' }}
      />

      {/* Selector de Disponibilidad (Con ANCHO FIJO para que no se aplaste) */}
      <FormControl size="small" variant="outlined" sx={{ minWidth: 220 }}>
        <InputLabel id="filtro-disponibilidad-label">Disponibilidad</InputLabel>
        <Select
          labelId="filtro-disponibilidad-label"
          value={filterDisponibilidad}
          label="Disponibilidad"
          onChange={(e) => setFilterDisponibilidad(e.target.value)}
        >
          <MenuItem value=""><em>Todos los estados</em></MenuItem>
          <MenuItem value="DISPONIBLE">Disponible</MenuItem>
          <MenuItem value="PRESTADO">Prestado</MenuItem>
          <MenuItem value="MANTENIMIENTO">En Mantenimiento</MenuItem>
        </Select>
      </FormControl>

      {/* Botón para Limpiar Filtros */}
      <Tooltip title="Limpiar Filtros">
        <IconButton 
          onClick={handleReset} 
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'action.hover', color: 'text.primary' }
          }}
        >
          <RotateCcw size={20} />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default InstrumentoFilters;