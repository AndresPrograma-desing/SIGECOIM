import React from 'react';
import { Box, Alert, TextField, MenuItem } from '@mui/material';
import DrawPanel from './DrawPanel';
import ColorPicker from './ColorPicker';

const InstrumentoDialog = ({
  open,
  onClose,
  editingInstrumento,
  formData,
  onChangeForm,
  onSubmit,
  formError,
  width = 500,
}) => {
  return (
    <DrawPanel
      width={width}
      open={open}
      onClose={onClose}
      title={editingInstrumento ? 'Editar Instrumento' : 'Registrar Nuevo Instrumento'}
      onSubmit={onSubmit}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Mensaje de Error */}
        {formError && (
          <Alert severity="error">
            {formError}
          </Alert>
        )}

        {/* Código de Inventario */}
        <TextField
          label="Código de Inventario"
          name="codigo_inventario"
          value={formData.codigo_inventario || ''}
          onChange={onChangeForm}
          disabled={!!editingInstrumento}
          placeholder="Ej: INST-001"
          fullWidth
          required
          variant="outlined"
        />

        {/* Nombre del Instrumento */}
        <TextField
          label="Nombre del Instrumento"
          name="nombre"
          value={formData.nombre || ''}
          onChange={onChangeForm}
          placeholder="Ej: Violín 4/4"
          fullWidth
          required
          variant="outlined"
        />

        {/* Marca */}
        <TextField
          label="Marca"
          name="marca"
          value={formData.marca || ''}
          onChange={onChangeForm}
          placeholder="Ej: Yamaha"
          fullWidth
          variant="outlined"
        />

        {/* Modelo */}
        <TextField
          label="Modelo"
          name="modelo"
          value={formData.modelo || ''}
          onChange={onChangeForm}
          placeholder="Ej: V3G"
          fullWidth
          variant="outlined"
        />

        {/* Número de Serie */}
        <TextField
          label="Número de Serie"
          name="numero_serie"
          value={formData.numero_serie || ''}
          onChange={onChangeForm}
          placeholder="Ej: SN-837482"
          fullWidth
          variant="outlined"
        />

        {/* Medida */}
        <TextField
          label="Medida"
          name="medida"
          value={formData.medida || ''}
          onChange={onChangeForm}
          placeholder="Ej: 1/2, 3/4, 4/4"
          fullWidth
          variant="outlined"
        />

        {/* Color Picker */}
        <ColorPicker
          value={formData.color || ''}
          onChange={onChangeForm}
        />

        {/* Tipo de Accesorios */}
        <TextField
          label="Tipo de Accesorios"
          name="accesorios"
          value={formData.accesorios || ''}
          onChange={onChangeForm}
          placeholder="Ej: Arco, Estuche, Resina"
          fullWidth
          variant="outlined"
        />

        {/* Estado de Conservación (Select) */}
        <TextField
          select
          label="Estado de Conservación"
          name="estado_conservacion"
          value={formData.estado_conservacion || ''}
          onChange={onChangeForm}
          fullWidth
          required
          variant="outlined"
        >
          <MenuItem value="NUEVO">Nuevo</MenuItem>
          <MenuItem value="BUENO">Bueno</MenuItem>
          <MenuItem value="REGULAR">Regular</MenuItem>
          <MenuItem value="MALO">Malo</MenuItem>
        </TextField>

        {/* Disponibilidad Inicial (Select) */}
        <TextField
          select
          label="Disponibilidad Inicial"
          name="estado_disponibilidad"
          value={formData.estado_disponibilidad || ''}
          onChange={onChangeForm}
          disabled={editingInstrumento && editingInstrumento.estado_disponibilidad === 'PRESTADO'}
          fullWidth
          required
          variant="outlined"
        >
          <MenuItem value="DISPONIBLE">Disponible</MenuItem>
          <MenuItem value="PRESTADO" disabled>Prestado (Automático)</MenuItem>
          <MenuItem value="MANTENIMIENTO">Mantenimiento</MenuItem>
        </TextField>
      </Box>
    </DrawPanel>
  );
};

export default InstrumentoDialog;