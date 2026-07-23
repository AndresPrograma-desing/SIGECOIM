import React from 'react';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select, Alert } from '@mui/material';

const UsuarioForm = ({ formData, onChangeForm, formError, isEdit }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {formError && <Alert severity="error">{formError}</Alert>}

      {/* Nombre Completo */}
      <TextField
        label="Nombre Completo"
        name="nombre"
        value={formData.nombre || ''}
        onChange={onChangeForm}
        placeholder="Ej: Carlos Mendoza"
        fullWidth
        required
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />

      {/* Correo Electrónico */}
      <TextField
        label="Correo Electrónico"
        type="email"
        name="email"
        value={formData.email || ''}
        onChange={onChangeForm}
        placeholder="Ej: cmendoza@sigecoim.com"
        fullWidth
        required
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />

      {/* Contraseña */}
      <TextField
        label={isEdit ? "Contraseña (Dejar en blanco para no cambiar)" : "Contraseña"}
        type="password"
        name="password"
        value={formData.password || ''}
        onChange={onChangeForm}
        placeholder="••••••••"
        fullWidth
        required={!isEdit}
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />

      {/* Rol del Usuario */}
      <FormControl fullWidth required variant="outlined">
        <InputLabel id="rol-label" shrink>Rol de Acceso</InputLabel>
        <Select
          labelId="rol-label"
          name="rol"
          value={formData.rol || 'COORDINADOR'}
          onChange={onChangeForm}
          label="Rol de Acceso"
          notched
        >
          <MenuItem value="COORDINADOR">Coordinador (Operador)</MenuItem>
          <MenuItem value="ADMINISTRADOR">Administrador General</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UsuarioForm;
