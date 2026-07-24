import React, { useEffect } from 'react';
import { Box, TextField, Typography, Divider, Grid, Alert } from '@mui/material';

const EstudianteForm = ({
  formData,
  setFormData,
  formError,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calcular la edad a partir de la fecha de nacimiento
  let edad = null;
  let esMenor = false;
  if (formData.fecha_nacimiento) {
    const birthDate = new Date(formData.fecha_nacimiento);
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--;
    }
    edad = computedAge;
    esMenor = computedAge < 18;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {formError && (
        <Alert severity="error">{formError}</Alert>
      )}

      <Typography variant="h6" fontWeight="600" color="primary">
        Datos del Estudiante
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido"
            name="apellido"
            value={formData.apellido || ''}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Cédula (Opcional)"
            name="cedula"
            value={formData.cedula || ''}
            onChange={handleChange}
            fullWidth
            placeholder="Ej: V-30123456"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento || ''}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Teléfono (Opcional)"
            name="telefono"
            value={formData.telefono || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Dirección de Habitación (Opcional)"
            name="direccion"
            value={formData.direccion || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {edad !== null && (
        <Box sx={{ 
          p: 1.5, 
          borderRadius: '8px', 
          backgroundColor: esMenor ? 'rgba(232, 93, 78, 0.08)' : 'rgba(46, 125, 50, 0.08)',
          border: esMenor ? '1px solid rgba(232, 93, 78, 0.2)' : '1px solid rgba(46, 125, 50, 0.2)',
          display: 'inline-block'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: esMenor ? 'secondary.main' : 'success.main' }}>
            {esMenor 
              ? `Menor de Edad (${edad} años) — Requiere obligatoriamente un Representante Legal.` 
              : `Mayor de Edad (${edad} años) — Actúa en representación propia.`}
          </Typography>
        </Box>
      )}

      {/* Sección del Representante Legal (Solo si es menor de edad) */}
      {esMenor && (
        <>
          <Divider sx={{ my: 1 }} />
          
          <Typography variant="h6" fontWeight="600" color="secondary">
            Datos del Representante Legal (Obligatorio)
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cédula del Representante"
                name="rep_cedula"
                value={formData.rep_cedula || ''}
                onChange={handleChange}
                fullWidth
                required
                placeholder="Ej: V-12345678"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del Representante"
                name="rep_nombre"
                value={formData.rep_nombre || ''}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido del Representante"
                name="rep_apellido"
                value={formData.rep_apellido || ''}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono del Representante"
                name="rep_telefono"
                value={formData.rep_telefono || ''}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email del Representante (Opcional)"
                name="rep_email"
                type="email"
                value={formData.rep_email || ''}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección del Representante"
                name="rep_direccion"
                value={formData.rep_direccion || ''}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={2}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default EstudianteForm;
