import React from 'react';
import { Box, TextField, MenuItem, Alert, FormControl, InputLabel, Select } from '@mui/material';
import SEMI from './Calendario';

const ComodatoForm = ({
  newComodato,
  setNewComodato,
  estudiantes,
  availableInstruments,
  formError,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComodato((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {formError && (
        <Alert severity="error">{formError}</Alert>
      )}

      {/* Correlativo del Contrato */}
      <TextField
        label="Correlativo del Contrato"
        name="folio_contrato"
        value={newComodato.folio_contrato || ''}
        onChange={handleChange}
        placeholder="Ej: COM-2026-001"
        fullWidth
        required
        variant="outlined"
        InputLabelProps={{ shrink: true }}
      />

      {/* Selector de Estudiante */}
      <FormControl fullWidth required variant="outlined">
        <InputLabel id="estudiante-label" shrink>Estudiante Beneficiario</InputLabel>
        <Select
          labelId="estudiante-label"
          name="estudiante_id"
          value={newComodato.estudiante_id || ''}
          onChange={handleChange}
          label="Estudiante Beneficiario"
          notched
          displayEmpty
        >
          <MenuItem value="" disabled>Seleccione un estudiante...</MenuItem>
          {estudiantes.length === 0 && (
            <MenuItem value="" disabled>No hay estudiantes registrados</MenuItem>
          )}
          {estudiantes.map((est) => (
            <MenuItem key={est.id_estudiante || est.id} value={est.id_estudiante || est.id}>
              {est.nombre} {est.apellido} - CI: {est.cedula}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Selector de Instrumento */}
      <FormControl fullWidth required variant="outlined">
        <InputLabel id="instrumento-label" shrink>Instrumento a Prestar</InputLabel>
        <Select
          labelId="instrumento-label"
          name="instrumento_id"
          value={newComodato.instrumento_id || ''}
          onChange={handleChange}
          label="Instrumento a Prestar"
          notched
          displayEmpty
        >
          <MenuItem value="" disabled>Seleccione un instrumento...</MenuItem>
          {availableInstruments.length === 0 && (
            <MenuItem value="" disabled>No hay instrumentos disponibles</MenuItem>
          )}
          {availableInstruments.map((inst) => (
            <MenuItem key={inst.id_instrumento || inst.id} value={inst.id_instrumento || inst.id}>
              {inst.codigo_inventario || inst.codigo} - {inst.nombre} ({inst.marca || 'Genérico'})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Fecha de Devolución Prevista (Calendario Propio SEMI) */}
      <SEMI
        value={newComodato.fecha_devolucion_prevista}
        onChange={(val) => setNewComodato((prev) => ({ ...prev, fecha_devolucion_prevista: val }))}
      />
      
    </Box>
  );
};

export default ComodatoForm;