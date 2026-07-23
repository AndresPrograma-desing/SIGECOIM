import React from 'react';
import { Box, TextField, MenuItem, Alert, FormControl, InputLabel, Select } from '@mui/material';

const DevolucionForm = ({
  selectedComodato,
  devolucionData,
  onChangeDevData,
  formError
}) => {
  if (!selectedComodato) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {formError && <Alert severity="error">{formError}</Alert>}

      <Alert severity="info" sx={{ mb: 1 }}>
        Recibiendo instrumento del contrato: <strong>{selectedComodato.folio_contrato}</strong>
      </Alert>

      {/* Estado al Recibir */}
      <FormControl fullWidth required variant="outlined">
        <InputLabel id="estado-recibir-label" shrink>Estado al Recibir</InputLabel>
        <Select
          labelId="estado-recibir-label"
          value={devolucionData.estado_instrumento_recibido || ''}
          onChange={(e) => onChangeDevData('estado_instrumento_recibido', e.target.value)}
          label="Estado al Recibir"
          notched
          displayEmpty
        >
          <MenuItem value="NUEVO">Nuevo</MenuItem>
          <MenuItem value="BUENO">Bueno</MenuItem>
          <MenuItem value="REGULAR">Regular</MenuItem>
          <MenuItem value="MALO">Malo</MenuItem>
        </Select>
      </FormControl>

      {/* Observaciones */}
      <TextField
        label="Observaciones"
        multiline
        rows={4}
        value={devolucionData.observaciones || ''}
        onChange={(e) => onChangeDevData('observaciones', e.target.value)}
        placeholder="Detalle cualquier golpe, raya o condición en la que llegó el instrumento..."
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />

    </Box>
  );
};

export default DevolucionForm;