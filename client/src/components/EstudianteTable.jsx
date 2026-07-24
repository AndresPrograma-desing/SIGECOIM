import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Chip,
  Box
} from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';

const EstudianteTable = ({
  estudiantes,
  onEdit,
  onDelete
}) => {
  // Función para calcular la edad
  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return '-';
    const birthDate = new Date(fechaNac);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Table sx={{ minWidth: 650 }} aria-label="tabla de estudiantes">
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell><Typography fontWeight="bold">Estudiante</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Cédula</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Edad / Nacimiento</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Representante Legal</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Contacto</Typography></TableCell>
            <TableCell align="right"><Typography fontWeight="bold">Acciones</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {estudiantes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                <Typography variant="body1" color="text.secondary">
                  No se encontraron estudiantes registrados.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            estudiantes.map((est) => {
              const edad = calcularEdad(est.fecha_nacimiento);
              const esMenor = typeof edad === 'number' ? edad < 18 : false;

              return (
                <TableRow key={est.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.selected' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography fontWeight="600">
                        {est.nombre} {est.apellido}
                      </Typography>
                      {esMenor ? (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip label="Menor de Edad" size="small" color="secondary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Box>
                      ) : (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip label="Mayor de Edad" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{est.cedula || 'S/N'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {edad} años
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {est.fecha_nacimiento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {est.representante ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" fontWeight="500">
                          {est.representante.nombre} {est.representante.apellido}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          CI: {est.representante.cedula}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Representación propia
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{est.telefono || 'Sin teléfono'}</Typography>
                      <Tooltip title={est.direccion || 'Sin dirección'}>
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>
                          {est.direccion || 'Sin dirección'}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Editar Estudiante">
                        <IconButton
                          color="primary"
                          onClick={() => onEdit(est)}
                          sx={{ '&:hover': { backgroundColor: 'rgba(232, 93, 78, 0.08)' } }}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar Estudiante">
                        <IconButton
                          color="error"
                          onClick={() => onDelete(est)}
                          sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EstudianteTable;
