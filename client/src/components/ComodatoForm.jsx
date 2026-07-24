import { Box, TextField, MenuItem, Alert, FormControl, InputLabel, Select, Typography } from '@mui/material';
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

  // Buscar el estudiante seleccionado
  const selectedEst = estudiantes.find(est => (est.id_estudiante || est.id) === newComodato.estudiante_id);
  
  // Calcular si es menor de edad y su edad
  let esMenor = false;
  let age = null;
  if (selectedEst && selectedEst.fecha_nacimiento) {
    const birthDate = new Date(selectedEst.fecha_nacimiento);
    const today = new Date();
    age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    esMenor = age < 18;
  }

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
              {est.nombre} {est.apellido} - CI: {est.cedula || 'S/N'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Caja de información del representante */}
      {selectedEst && (
        <Box sx={{ 
          mt: -1, 
          p: 2, 
          borderRadius: '10px', 
          backgroundColor: esMenor ? 'rgba(226, 88, 62, 0.08)' : 'rgba(15, 23, 42, 0.04)',
          border: esMenor ? '1px solid rgba(226, 88, 62, 0.2)' : '1px solid rgba(15, 23, 42, 0.08)',
        }}>
          {esMenor ? (
            <>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 0.5 }}>
                Menor de Edad ({age} años) - Requiere Representante Legal
              </Typography>
              {selectedEst.representante ? (
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  <strong>Representante:</strong> {selectedEst.representante.nombre} {selectedEst.representante.apellido} <br />
                  <strong>Cédula:</strong> {selectedEst.representante.cedula} | <strong>Telf:</strong> {selectedEst.representante.telefono}
                </Typography>
              ) : (
                <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                  ⚠️ Este estudiante no posee un representante asociado en su perfil. Edita sus datos en el módulo de Estudiantes.
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🎉 Mayor de Edad ({age} años) - Actúa en representación propia (Comodatario)
            </Typography>
          )}
        </Box>
      )}

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