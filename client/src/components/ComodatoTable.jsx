import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import { CheckCircle, Edit, Trash } from 'lucide-react';
import EmptyState from './illustrations/EmptyState';

const ComodatoTable = ({ comodatos, onDevolucion, onEdit, onDelete }) => {
  const getEstadoComodatoColor = (estado) => {
    switch (estado) {
      case 'ACTIVO': return 'warning';
      case 'FINALIZADO': return 'success';
      case 'VENCIDO': return 'error';
      default: return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell><Typography fontWeight="bold">Folio</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Estudiante / Rep.</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Instrumento</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Plazo</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Estado</Typography></TableCell>
            <TableCell align="right"><Typography fontWeight="bold">Acción</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comodatos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState
                  title="Aún no hay préstamos registrados"
                  subtitle="Los comodatos que registres aparecerán aquí con su plazo y estado."
                />
              </TableCell>
            </TableRow>
          ) : (
            comodatos.map((com) => (
              <TableRow key={com.id} hover>
                <TableCell fontWeight="bold">{com.folio_contrato}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">
                    {com.estudiante?.nombre} {com.estudiante?.apellido}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Representante: {com.estudiante?.representante?.nombre} {com.estudiante?.representante?.apellido}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">
                    {com.instrumento?.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Cód: {com.instrumento?.codigo_inventario}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, whiteSpace: 'nowrap' }}>
                    <Typography variant="caption">
                      <b>Inicio:</b> {com.fecha_inicio}
                    </Typography>
                    <Typography variant="caption">
                      <b>Límite:</b> {com.fecha_devolucion_prevista}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={com.estado}
                    size="small"
                    color={getEstadoComodatoColor(com.estado)}
                    sx={{ fontWeight: '500' }}
                  />
                  {com.estado === 'FINALIZADO' && com.devolucion && (
                    <Typography variant="caption" color="success.main" display="block" sx={{ mt: 0.5, whiteSpace: 'nowrap' }}>
                      Devuelto el {com.devolucion.fecha_devolucion}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {com.estado === 'ACTIVO' ? (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton color="primary" onClick={() => onEdit(com)} size="small">
                        <Edit size={16} />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDelete(com.id)} size="small">
                        <Trash size={16} />
                      </IconButton>
                      <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        startIcon={<CheckCircle size={14} />}
                        onClick={() => onDevolucion(com)}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
                      >
                        Devolver
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                      <Chip label="Completado" size="small" variant="outlined" color="success" />
                      <IconButton color="error" onClick={() => onDelete(com.id)} size="small">
                        <Trash size={16} />
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComodatoTable;
